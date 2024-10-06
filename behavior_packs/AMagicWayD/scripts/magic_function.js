import { world, system, MolangVariableMap, ItemStack } from "@minecraft/server";
import * as ItemData from "./item_list";
import { Vector } from "./Vector3";
import { setCooldown } from "./main";

const particleMap = new MolangVariableMap();

var fall_climb = {};
var possesion_actor = {};
var player_rewind = {};
var sequence_cast_id = {};
var setupVoodooId = {};
var single_scan_id = {};
var remove_single_scan_id = {};
var volume_id = 0;
var volume_effect_id = {};

var cancel_spell = [];
var timeout_single_scan_time = {};

var player_register_effect = {};
var player_cast_id = {};
var player_jump = {};
var player_press_jump = {};
var actor_dead = [];
var entity_damage = {};
var has_freeze = {};

const MagicPlaceholderPattern = [
	{ x: 0, y: 0 },   { x: 0, y: 14 },
	{ x: 0, y: 26 },  { x: 0, y: 36 },
	{ x: 0, y: 43 },  { x: 0, y: 45 },
	{ x: 0, y: 43 },  { x: 0, y: 36 },
	{ x: 0, y: 26 },  { x: 0, y: 14 },
	{ x: 0, y: 0 },   { x: 0, y: -14 },
	{ x: 0, y: -26 }, { x: 0, y: -36 },
	{ x: 0, y: -43 }, { x: 0, y: -45 },
	{ x: 0, y: -43 }, { x: 0, y: -36 },
	{ x: 0, y: -26 }, { x: 0, y: -14 }
]

world.afterEvents.entityHealthChanged.subscribe(s =>{
	entity_damage[s.entity.id] = s.oldValue - s.newValue;
});
world.afterEvents.playerJoin.subscribe(s =>{
	if(player_cast_id[s.playerId] != undefined) return;
	let id = Object.keys(player_cast_id).length % 10;
	player_cast_id[s.playerId] = id;
});

for(let playerData of world.getPlayers()){
	let id = Object.keys(player_cast_id).length % 10;
	player_cast_id[playerData.id] = id;
}

world.afterEvents.playerSpawn.subscribe(s=>{
	actor_dead.pop(s.player.id);
})

world.afterEvents.entityDie.subscribe(s=>{
	actor_dead.push(s.deadEntity.id);
	s.deadEntity.runCommand("scriptevent amw:spell deactive");
}, { entityTypes: [ "minecraft:player" ] })

system.runInterval(() => {
	let scan_keys = Object.keys(single_scan_id);
	for(let keys of scan_keys){
		let cluster_keys = Object.keys(single_scan_id[keys]);

		for(let cluster of cluster_keys){
			for(let scan of single_scan_id[keys][cluster]){
				if(typeof scan === "object"){
					if(!scan.isValid()) single_scan_id[keys][cluster].pop(scan);
				}else{
					if(world.getEntity(scan) == undefined) single_scan_id[keys][cluster].pop(scan);
				}
			}
			
			if(remove_single_scan_id[keys][cluster] != undefined){
				if(system.currentTick > remove_single_scan_id[keys][cluster]){
					delete remove_single_scan_id[keys][cluster];
					delete single_scan_id[keys][cluster];
				}
			}
		}
	}
	for(let playerData of world.getPlayers()){
		if(!player_jump[playerData.id] && playerData.isJumping){
			player_jump[playerData.id] = true;
			player_press_jump[playerData.id] = true;
		}else{
			player_press_jump[playerData.id] = false;
		}

		if(player_jump[playerData.id] && !playerData.isJumping){
			player_jump[playerData.id] = false;
		}

		if(player_rewind[playerData.id] == undefined){
			player_rewind[playerData.id] = {
				use: false,
				motion: [
					{
						location: playerData.location,
						rotation: playerData.getRotation()
					}
				]
			}
		}else{
			if(player_rewind[playerData.id].use == false){
				player_rewind[playerData.id].motion.push({
					location: playerData.location,
					rotation: playerData.getRotation()
				});
				if(player_rewind[playerData.id].motion.length > 200) player_rewind[playerData.id].motion.shift();
			}
		}
	}
});

function findObjectKey(data, address, value){
	let key = address.shift();
	if(key == undefined){
		return value;
	}
	if(data[key] !== undefined){
		data[key] = findObjectKey(data[key], address, value)
	}
	return data;
}

function anglesToVector(r) {
	return {
		x: Math.cos(r.x / 180 * Math.PI) * -Math.sin(r.y / 180 * Math.PI),
		y: -Math.sin(r.x / 180 * Math.PI),
		z: Math.cos(r.x / 180 * Math.PI) * Math.cos(r.y / 180 * Math.PI)
	};
}

function createBoxAreaParticle(dimension, location, size, height, duration, r, g, b, a){
	let data = new MolangVariableMap();
	data.setColorRGBA("variable.color", { red: r, green: g, blue: b, alpha: a});
	data.setSpeedAndDirection("variable.data", height, new Vector(size, duration, 0));
	
	dimension.spawnParticle("magic:area_effect_box_magic_z", { x: location.x + size/2, y: location.y + 0.01, z: location.z }, data);
	dimension.spawnParticle("magic:area_effect_box_magic_z", { x: location.x - size/2, y: location.y + 0.01, z: location.z }, data);
	dimension.spawnParticle("magic:area_effect_box_magic_x", { x: location.x, y: location.y + 0.01, z: location.z + size/2 }, data);
	dimension.spawnParticle("magic:area_effect_box_magic_x", { x: location.x, y: location.y + 0.01, z: location.z - size/2 }, data);
	dimension.spawnParticle("magic:area_effect_box_magic_y", { x: location.x, y: location.y + 0.01, z: location.z }, data);
}

function createLineSpellParticle(dimension, start_loc, end_loc, r, g, b, a, density = 3, size = 0.5, duration = 0.1){
	let line_map = new MolangVariableMap();
	
	let distance = Vector.distance(start_loc, end_loc) + 0.01;
	let direction = Vector.subtract(end_loc, start_loc).divide(distance);
	
	line_map.setVector3("variable.direction", direction);
	line_map.setFloat("variable.length", distance);
	line_map.setColorRGBA("variable.color", { red: r, green: g, blue: b, alpha: 1});
	line_map.setVector3("variable.location", {x: 0, y: 0, z: 0 });
	dimension.spawnParticle("magic:cast_inline_guide", start_loc, line_map);
}

function createCircleBlast(dimension, loc, r, g, b, a, size = 1, duration = 1){
	let data = new MolangVariableMap();
	data.setColorRGBA("variable.color", { red: r, green: g, blue: b, alpha: a});
	data.setVector3("variable.data", new Vector(size, duration, 0));

	dimension.spawnParticle("magic:area_circle_blast", loc, data);
}

export function createDummySource(dimension, Ilocation, Iview = { x: 0, y: 0, z: 0 }, type = { id: -1, typeId: "magic:source"}){
	let location = Object.freeze(Ilocation);
	let view = Object.freeze(Iview.z == undefined ? anglesToVector(Iview) : Iview);
	return {
		dimension: dimension,
		location: {
			x: location.x,
			y: location.y,
			z: location.z
		},
		id: type.id,
		typeId: type.typeId,
		getViewDirection(){
			return {
				x: view.x,
				y: view.y,
				z: view.z
			}
		},
		getVelocity(){
			return {
				x: location.x,
				y: location.y,
				z: location.z
			}
		},
		getHeadLocation(){
			return {
				x: location.x,
				y: location.y,
				z: location.z
			}
		},
		getRotation(){
			let x = Math.atan2(-view.y, Math.sqrt(view.x * view.x + view.z * view.z))* 180 / Math.PI;
			let y = -Math.atan2(-view.x, -view.z)* 180 / Math.PI + 180;
			if(y > 180) y = -(360 - y);
			return { x: x, y: y };
		},
		getEntitiesFromViewDirection(modifier = null){
			return dimension.getEntitiesFromRay(location, view, modifier);
		},
		getBlockFromViewDirection(modifier = null){
			return dimension.getBlockFromRay(location, view, modifier);
		},
		isValid(){
			return true;
		}
	}
}

export function addCustomEffect(source, modifier){
	if(source.typeId != "minecraft:player") return;
	if(!player_register_effect[source.id]){
		player_register_effect[source.id] = {};
	}
	let duration = 600;
	if(modifier.duration) duration = modifier.duration;
	// if(duration < 20) duration = 20;
	if(modifier.prevent_duplicate){
		if(!player_register_effect[source.id][modifier.name] || system.currentTick > player_register_effect[source.id][modifier.name]){
			source.runCommand("scriptevent amw:effect " + modifier.name + " " + (duration / 20));
			player_register_effect[source.id][modifier.name] = system.currentTick + duration;
		}
	}else{
		source.runCommand("scriptevent amw:effect " + modifier.name + " " + (duration / 20));
		player_register_effect[source.id][modifier.name] = system.currentTick + duration;
	}
}

export function createSourceDummy(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;

	modifier.spell.id(createDummySource(source.dimension, (modifier.head_location ? source.getHeadLocation() : source.location), source.getViewDirection()), modifier.spell.modifier);
}

export function despawnTarget(source, modifier){
	if(modifier.target == undefined || modifier.target == "self"){
		source.remove();
	}else{
		modifier[modifier.target].remove();
	}
}

export function setEquipment(source, modifier){
	// let equipment = source.getComponent("minecraft:equippable");
	for(let data of modifier.equipment){
		try{
			let amount = (data.item.amount == undefined) ? 1 : data.item.amount;
			// let item = new ItemStack(data.item.name, amount); 
			// equipment.setEquipment(data.slot, item);
			
			if(data.slot != "mainhand" && data.slot != "offhand"){
				source.runCommand("replaceitem entity @s slot.armor." + data.slot + " 0 " + data.item.name + " " + amount);
			}else{
				source.runCommand("replaceitem entity @s slot.weapon." + data.slot + " 0 " + data.item.name + " " + amount);
			}
		}catch(err){
			continue;
		}
	}
}

export function copyEquipment(source, modifier){
	let copy;
	let paste;
	let slotId;

	if(modifier.slot == undefined){
		slotId = [ "Chest", "Feet", "Head", "Legs", "Mainhand", "Offhand" ];
	}else{
		slotId = modifier.slot;
	}

	if(modifier.from == undefined || modifier.from == "source"){
		copy = modifier.source;
	}else if(modifier.from == "self"){
		copy = source;
	}else if(modifier.from == "actor"){
		copy = modifier.actor;
	} 
	if(modifier.to == undefined || modifier.to == "self"){
		paste = source;
	}else if(modifier.to == "source"){
		paste = modifier.source;
	}else if(modifier.to == "actor"){
		paste = modifier.actor;
	} 

	copy = copy.getComponent("minecraft:equippable");
	// paste = paste.getComponent("minecraft:equippable");
	
	for(let data of slotId){
		try{
			let item = copy.getEquipment(data);
			if(data != "Mainhand" && data != "Offhand"){
				paste.runCommand("replaceitem entity @s slot.armor." + data + " 0 " + item.typeId);
			}else{
				paste.runCommand("replaceitem entity @s slot.weapon." + data + " 0 " + item.typeId);
			}
			// paste.setEquipment(data, item);
		}catch(err){
			continue;
		}
	}
}

export function createBoxParticleFromSource(source, modifier){
	createBoxAreaParticle(source.dimension, source.location, modifier.size, modifier.height, modifier.duration/20, modifier.r, modifier.g, modifier.b, modifier.a);
}

export function createCircleBlastFromSource(source, modifier){
	let loc = source.location;
	if(modifier.offset != undefined){
		loc = Vector.add(loc, modifier.offset);
	}
	if(modifier.layer != undefined){
		for(let i = 0; i < modifier.layer; i++){
			createCircleBlast(source.dimension, loc, modifier.r, modifier.g, modifier.b, modifier.a, modifier.size, modifier.duration);
			loc.y += modifier.gap;
		}
	}else{
		createCircleBlast(source.dimension, loc, modifier.r, modifier.g, modifier.b, modifier.a, modifier.size, modifier.duration);
	}
	
}

export function createLineSpellActorToSource(source, modifier){
	if(modifier.start == modifier.end) return;
	let duration = 0.1;
	if(modifier.duration != undefined) duration = modifier.duration;

	let start = modifier[modifier.start];
	let end = modifier[modifier.end];
	if(modifier.start == "self") start = source;
	if(modifier.end == "self") end = source;

	if(modifier.duration == undefined){
		createLineSpellParticle(start.dimension, Vector.add(start.location, { x: 0, y: 1, z: 0 }), Vector.add(end.location, { x: 0, y: 1, z: 0 }), modifier.r, modifier.g, modifier.b);
	}else{
		let duration = modifier.duration;
		let interval = system.runInterval(()=>{
			if(duration <= 0){
				system.clearRun(interval);
				return;
			}
			try{
				createLineSpellParticle(start.dimension, Vector.add(start.location, { x: 0, y: 1, z: 0 }), Vector.add(end.location, { x: 0, y: 1, z: 0 }), modifier.r, modifier.g, modifier.b);
				duration--;
			}catch(err){
				system.clearRun(interval);
			}
		})
	}
}

export function createParticle(source, modifier){
	let location = source.location;
	if(modifier.offset != undefined){
		location = Vector.add(modifier.offset, location);
	}
	let map;
	if(modifier.data == undefined){
		map = particleMap;
	}else{
		map = new MolangVariableMap();
		for(let particle_data of modifier.data){
			let var_name = "variable." + particle_data.name;
			let data = particle_data.data;
			if(typeof data === "object"){
				if(data.x == undefined){
					if(data.alpha == undefined) data.alpha = 0;
					map.setColorRGBA(var_name, data);
				}else{
					if(data.speed == undefined){
						map.setVector3(var_name, data);
					}else{
						map.setSpeedAndDirection(var_name, data.speed, {x: data.x, y: data.y, z: data.z});
					}
				}
			}else if(typeof data === "number"){
				map.setFloat(var_name, data);
			}else if(typeof data === "string"){
				switch (data) {
					case "velocity":
						map.setVector3(var_name, source.getVelocity());
						break;
					case "view":
						map.setVector3(var_name, source.getViewDirection());
						break;
					case "rotation":
						let rotation = source.getRotation();
						rotation.z = 0;
						map.setVector3(var_name, rotation);
						break;
					case "distance":
						let distance = 0;
						let target = source.getEntitiesFromViewDirection();
						if(target != undefined && target.length > 0){
							distance = target[0].distance;
						}else{
							target = source.getBlockFromViewDirection();
							if(target != undefined) distance = target.distance;
						}
						map.setFloat(var_name, distance);
						break;
				}
			}
		}
	}
	if(modifier.start_tick == undefined || modifier.start_tick == 0){
		source.dimension.spawnParticle(modifier.particle, location, map);
	}else{
		system.runTimeout(()=>{
			source.dimension.spawnParticle(modifier.particle, location, map);
		}, modifier.start_tick);
	}
}

export function convertSoul(source, modifier){
	if(source.runCommand("testfor @s[scores={amw:soul=100}]").successCount != 0){
		throw new Error("0");
		return;
	}
	let exp = source.getTotalXp();
	if(exp > 5){
		if(exp == source.addExperience(-5)){
			source.addLevels(-1);
			source.addExperience(source.totalXpNeededForNextLevel - 5);
		}
		source.runCommand("scoreboard players add @s[scores={amw:soul=!100}] amw:soul 1");
	}else{
		throw new Error("0");
	}
}

export function navigationToTarget(source, modifier){
	let target_location;
	if(modifier.terget == undefined || modifier.terget == "source"){
		target_location = modifier.source.location;
	}else if(modifier.terget == "actor"){
		target_location = modifier.actor.location;
	}else if(modifier.terget == "view"){
		target_location = Vector.add(source.location, Vector.multiply(source.getViewDirection(), 8));
	}

	if(modifier.offset != undefined){
		target_location = Vector.add(target_location, modifier.offset);
	}

	let direction = Vector.subtract(target_location, source.location);
	direction = Vector.divide(direction, (Vector.getLength(direction)+1) * 20);

	let x = Math.atan2(-direction.y, Math.sqrt(direction.x * direction.x + direction.z * direction.z))* 180 / Math.PI;
	let y = -Math.atan2(-direction.x, -direction.z)* 180 / Math.PI + 180;
	if(y > 180) y = -(360 - y);
	let rotation = { x: x, y: y};

	direction.y = 0;
	if(source.isInWater){
		direction.y = 0.05;
	}else{
		if(source.isOnGround){
			let block = source.dimension.getBlockFromRay(source.location, direction, {includeLiquidBlocks: false, includePassableBlocks: false, maxDistance: 1});
			if(block != undefined){
				let block_location = Vector.add(block.block.location, block.faceLocation);
				if(Vector.distance(block_location, source.location) < 1){
					direction.y = 0.5;
				}
			}
		}
	}
	if(modifier.multiply != undefined){
		direction = Vector.multiply(direction, modifier.multiply);
	}

	if(source.typeId == "minecraft:player"){
		direction = Vector.multiply(direction, 15);
		source.applyKnockback(direction.x, direction.z, 1.5, direction.y / 3 - 0.6);
	}else{
		source.applyImpulse(direction);
		source.setRotation(rotation);
	}
}

export function limitMovementCooldown(source, modifier){
	let target;
	if(modifier.target == "source"){
		target = source;
	}else{
		target = modifier.actor;
	}
	if(target.typeId == "minecraft:player") target.onScreenDisplay.setActionBar("Move to cancel spell");

	let threshold = (modifier.threshold != undefined) ? modifier.threshold : 0.01;
	let duration = modifier.duration;

	let runId = system.runInterval(()=> {
		let velocity = target.getVelocity();
		let speed = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2) + Math.pow(velocity.z, 2));
		if(speed > threshold){
			if(modifier.target == undefined || modifier.target != "source") setCooldown(target.id, 0);
			if(sequence_cast_id[target.id] != undefined) system.clearRun(sequence_cast_id[target.id]);
			system.clearRun(runId);
			return;
		}
		if(duration <= 0){
			if(modifier.target == undefined || modifier.target != "source") setCooldown(target.id, 0);
			system.clearRun(runId);
			return;
		}

		if(modifier.target == undefined || modifier.target != "source") setCooldown(target.id, parseInt(duration/modifier.duration*50));
		duration--;
	});
}

export function rewind(source, modifier){
	if(player_rewind[source.id] == undefined){
		throw "udefined data";
	}
	if(player_rewind[source.id].motion.length <= 0){
		delete player_rewind[source.id];
		throw "finished data";
	}
	player_rewind[source.id].use = true;
	let motion = player_rewind[source.id].motion.pop();
	source.teleport(motion.location, { rotation: motion.rotation });
	if(system.currentTick % 10 == 0) source.dimension.spawnParticle("magic:void_magic_cast_impact", motion.location, particleMap);
}

export function stopRewind(source, modifier){
	player_rewind[source.id].use = false;
}

export function stopPossesion(source, modifier){
	let actor = modifier[modifier.controller];
	let id = actor.id;
	
	actor.runCommand("camera " + actor.name + " clear");
	actor.removeTag("disable_dtp");
	delete possesion_actor[id];
}

export function possesion(source, modifier){
	let actor = modifier[modifier.controller];
	let id = actor.id;
	if(possesion_actor[id] == undefined) possesion_actor[id] = actor.location;

	let velocity = actor.getVelocity();
	let location = source.location;
	location.y = source.getHeadLocation().y + 1;
	velocity.x *= 2;
	velocity.z *= 2;
	let rotation = actor.getRotation();
	actor.addTag("disable_dtp");
	actor.runCommand("camera " + actor.name + " set minecraft:free ease 0.1 linear pos " + location.x + " " + location.y + " " + location.z + " rot " + rotation.x + " " + rotation.y);

	if(velocity.x > 0.01 || velocity.z > 0.01 || velocity.x < -0.01 || velocity.z < -0.01 || velocity.y > 0.01){
		if(velocity.y > 0.1) velocity.y *= 1.5;
		if(source.getVelocity().y != 0) velocity.y = 0;
		actor.teleport(possesion_actor[id]);

		if(source.typeId == "minecraft:player") {
			source.applyKnockback(velocity.x, velocity.z, 1, velocity.y);
		}else{
			source.applyImpulse(velocity);
		}
	}
	source.setRotation(rotation);
}

export function wallClimb(source, modifier){
	let vel = source.getVelocity();
	let dist = Math.sqrt(Math.pow(vel.x, 2) + Math.pow(Math.max(vel.y-0.25, 0), 2) + Math.pow(vel.z, 2));
	let block;
	let block_loc = [
		{ x: 0.45 , y: 0, z: 0 },
		{ x: -0.45 , y: 0, z: 0 },
		{ x: 0 , y: 0, z: 0.45 },
		{ x: 0 , y: 0, z: -0.45 }
	]
	for(let offset of block_loc){
		let loc = source.location;
		loc.x += offset.x;
		loc.y += offset.y;
		loc.z += offset.z;
		block = source.dimension.getBlock(loc);
		if(!block.isAir && !block.isLiquid) break;
	}
	if(!block.isAir && !block.isLiquid){
		if(dist > 0.0005 || source.isJumping){
			source.applyKnockback(0, 0, 0, 0.25);
			fall_climb[source.id] = {};
		}else{
			source.applyKnockback(0, 0, 0, 0.01);
			let loc = source.location;
			loc.y -= 0.1;
			let floor = source.dimension.getBlock(loc);
			if(!floor.isAir && !block.floor && fall_climb[source.id]){
				delete fall_climb[source.id];
				source.addEffect("slow_falling", 1, { amplifier: 1, showParticles: false });
			}
		}
	}
	source.dimension.spawnParticle("magic:dark_magic_cast_impact", source.location, particleMap);
}

export function explosion(source, modifier){
	let data = {
		source: modifier.actor
	}
	if(modifier.source != undefined) data.source = modifier[modifier.source];
	if(modifier.source == "self") data.source = source;
	if(modifier.underwater != undefined) data.allowUnderwater = (modifier.underwater == true);
	if(modifier.break != undefined) data.breaksBlocks = (modifier.break == true);
	if(modifier.fire != undefined) data.causesFire = (modifier.fire == true);

	source.dimension.createExplosion(source.location, modifier.radius, data);
}

export function setKnockbackArea(source, modifier){
	let dimension = source.dimension;
	let size_sub = Vector.subtract(modifier.size, { x: 0.25, y: 0.25, z: 0.25 })
	let size = {
		x: size_sub.x,
		y: size_sub.y,
		z: size_sub.z
	};
	let location = source.location;
	let ancor = location;
	location = Vector.subtract(location, Vector.divide(size_sub, 2));
	location = Vector.subtract(location, { x: 0.25, y: 0.25, z: 0.25 });

	if(modifier.offset) location = Vector.add(location, modifier.offset);
	let strength = 1;
	if(modifier.strength != undefined) strength = modifier.strength;

	createBoxAreaParticle(dimension, ancor, 1, 5, 20, 1.0, 1.0, 0.9, 0.3);
	if(modifier.duration == undefined){
		for(let entity of dimension.getEntities({location: location, volume: size})){
			if(!modifier.include_actor && modifier.actor.id == entity.id) continue;
			if(!modifier.include_source && source.id == entity.id) continue;
			let entity_loc = entity.location;
			entity_loc = Vector.subtract(entity_loc, location);
			entity_loc = Vector.divide(entity_loc, Vector.getLength(entity_loc) + 0.001);
			entity_loc = Vector.multiply(entity_loc, strength);
			if(entity.hasComponent("minecraft:projectile")){
				let projectile = entity.getComponent("minecraft:projectile");
				projectile.shoot(entity_loc, { uncertainty: 5 });
			}else if(entity.typeId == "minecraft:item"){
				entity.applyImpulse(Vector.divide(entity_loc, 10));
			}else{
				entity.applyKnockback(entity_loc.x, entity_loc.z, Math.sqrt(entity_loc.x ** 2 + entity_loc.z ** 2), entity_loc.y);
			}
		}
	}else{
		let duration = modifier.duration;
		let area_run_id = system.runInterval(()=>{
			for(let entity of dimension.getEntities({location: location, volume: size})){
				if(duration <= 0){
					system.clearRun(area_run_id);
					return;
				}
				if(!modifier.include_actor && modifier.actor.id == entity.id) continue;
				if(!modifier.include_source && source.id == entity.id) continue;
				let entity_loc = entity.location;
				entity_loc = Vector.subtract(entity_loc, ancor);
				entity_loc = Vector.divide(entity_loc, Vector.getLength(entity_loc) + 0.001);
				entity_loc = Vector.multiply(entity_loc, strength);
				if(entity.hasComponent("minecraft:projectile")){
					let projectile = entity.getComponent("minecraft:projectile");
					projectile.shoot(entity_loc, { uncertainty: 5 });
				}else if(entity.typeId == "minecraft:item"){
					entity.applyImpulse(Vector.divide(entity_loc, 10));
				}else{
					entity.applyKnockback(entity_loc.x, entity_loc.z, Math.sqrt(entity_loc.x ** 2 + entity_loc.z ** 2), entity_loc.y);
				}
			}
			duration--;
		});
	}
}

export function absoluteArea(source, modifier){
	let dimension = source.dimension;
	let loc = source.location;
	loc.y -= 2.95;
	let volume_loc = source.location;
	volume_loc.y -= 2.95;
	volume_loc.x -= modifier.size/2;
	volume_loc.z -= modifier.size/2;
	let registered_entity = [];
	let size = {
		x: modifier.size-1,
		y: modifier.height,
		z: modifier.size-1,
	};
	for(let entity of dimension.getEntities({location: volume_loc, volume: size})){
		if(entity.typeId == "minecraft:item") continue;
		registered_entity.push(entity.id);
	}
	createBoxAreaParticle(dimension, loc, modifier.size+0.09, modifier.height + 0.1, modifier.duration, 1.0, 1.0, 0.9, 0.3);
	createBoxAreaParticle(dimension, loc, modifier.size+0.06, modifier.height + 0.2, modifier.duration, 1.0, 1.0, 0.9, 0.3);
	createBoxAreaParticle(dimension, loc, modifier.size+0.03, modifier.height + 0.3, modifier.duration, 1.0, 1.0, 0.9, 0.3);
	createBoxAreaParticle(dimension, loc, modifier.size, modifier.height + 0.4, modifier.duration, 1.0, 1.0, 0.9, 0.3);
	createBoxAreaParticle(dimension, loc, modifier.size-0.03, modifier.height + 0.5, modifier.duration, 1.0, 1.0, 0.9, 0.3);
	createBoxAreaParticle(dimension, loc, modifier.size-0.06, modifier.height + 0.6, modifier.duration, 1.0, 1.0, 0.9, 0.3);
	createBoxAreaParticle(dimension, loc, modifier.size-0.09, modifier.height + 0.7, modifier.duration, 1.0, 1.0, 0.9, 0.3);

	let run_id = system.runInterval(() => {	
		for(let entity of dimension.getEntities({location: volume_loc, volume: size})){
			if(entity.typeId == "minecraft:item") continue;
			if(registered_entity.includes(entity.id)) continue;
			let vel = entity.getVelocity();
			let entity_loc = entity.location;
			let dist_x = entity_loc.x - loc.x;
			let dist_z = entity_loc.z - loc.z;
			let dist_y = entity_loc.y - (loc.y + modifier.size/2);
			try{
				if(entity.hasComponent("minecraft:projectile")){
					let projectile = entity.getComponent("minecraft:projectile");
					
					if(registered_entity.includes(projectile.owner.id)) continue;
					projectile.shoot({ x: dist_x * 0.5, y: dist_y * 0.5, z: dist_z * 0.5 }, { uncertainty: 5 });
					registered_entity.push(entity.id);
				}else{
					entity.applyKnockback(dist_x, dist_z, 1, Math.max(Math.min(dist_y, 0.5), -0.5));
				}
			}catch(err){}
		}
	});
	system.runTimeout(() => {	
		system.clearRun(run_id);
	}, modifier.duration*20);
}

export function lightning(source, modifier){
	source.dimension.spawnEntity("lightning_bolt", source.location);
	let location = source.location;
	location.y += 1;
	source.dimension.spawnParticle("magic:lightning_cast_impact", location, particleMap);
}

export function castAtFloor(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = source;

	let loc = source.location;
	if(modifier.offset != undefined){
		loc = Vector.add(loc, modifier.offset);
	}
	let dimension = source.dimension;
	let block = dimension.getBlockFromRay(loc, {x: 0, y: -1, z: 0}, { includePassableBlocks: false });
	let location = Vector.add(block.block.location, block.faceLocation);

	modifier.spell.id(createDummySource(dimension, location, {x: 0, y: -1, z: 0}), modifier.spell.modifier);
}

export function summonAtFloor(source, modifier){
	let dimension = source.dimension;
	let block = dimension.getBlockFromRay(Vector.add(source.location, {x: 0, y: 1, z: 0}), {x: 0, y: -1, z: 0}, { includePassableBlocks: true });
	let location = Vector.add(block.block.location, block.faceLocation);

	if(modifier.round_location){
		location.x = Math.round(location.x) - 0.5;
		location.z = Math.round(location.z) + 0.5;
	}

	if(modifier.do_not_spawn_at_actor && Vector.distance(modifier.actor.location, location) < 1.5) return;

	let entity = undefined;
	try{
		entity = dimension.spawnEntity(modifier.type, location);
		if(entity.hasComponent("minecraft:projectile")){
			let projectile = entity.getComponent("minecraft:projectile");
			if(modifier.owner == "self") projectile.owner = source;
			if(modifier.owner != undefined){
				projectile.owner = modifier[modifier.owner];
			}else{
				projectile.owner = (source.id != -1 ) ?  source : modifier.actor;
			}
			// if(entity.typeId == "amw:summon_placeholder"){
			// 	let entity_name = "summoned_magic" + entity.id;
			// 	entity.nameTag = entity_name;
			// 	let run_count = 2;
			// 	let run_check_target_id = system.runInterval(()=>{
			// 		if(!entity.isValid()){
			// 			// console.warn("entity not found, cheking new one!");
			// 			let entity_temp = dimension.getEntities({name: entity_name});
			// 			// console.warn("entity with similar is : " + entity_temp.length)

			// 			if(entity_temp.length > 0){
			// 				entity = entity_temp[0];
			// 				// console.warn("entity found, replacing to new entity!");
			// 				entity.nameTag = "";
			// 				system.clearRun(run_check_target_id);
			// 			}
			// 		}
			// 		if(run_count <= 0){
			// 			if(entity.isValid()) entity.nameTag = "";
			// 			system.clearRun(run_check_target_id);
			// 		}
			// 		run_count--;
			// 	});
			// }
		}else{
			if(modifier.copy_rotation) entity.setRotation(source.getRotation());

			if(entity.hasComponent("minecraft:tameable")){
				let tame = source;
				if(modifier.owner == "self") tame = source;
				if(modifier.owner != undefined){
					tame = modifier[modifier.owner];
				}else{
					tame = (source.id != -1 ) ?  source : modifier.actor;
				}
				entity.getComponent("minecraft:tameable").tame(tame);
			}
		}

	}catch(err){
		dimension.runCommandAsync("summon " + modifier.type + " " + location.x + " " + location.y + " " + location.z);
	}
	if(entity != undefined && Vector.distance(location, entity.location) > 0.1){
		entity.teleport(location)
	}
	
	source.dimension.spawnParticle("magic:earth_magic_cast_impact", {x: location.x, y: location.y, z: location.z}, particleMap);

	if(modifier.despawn != undefined && entity != undefined){
		system.runTimeout( () => {
			try{
				entity.remove();
			}catch(err){}
		}, modifier.despawn);
	}

	if(modifier.spell != undefined){
		if(entity == undefined) entity = createDummySource(dimension, location);
		let spell = modifier.spell.modifier;
		spell.actor = modifier.actor;
		spell.item = modifier.item;
		if(modifier.source_target == undefined || modifier.source_target == "self"){
			spell.source = source;
		}else if(modifier.source_target == "summon"){
			spell.source = entity;
		}else if(modifier.source_target == "source"){
			spell.source = modifier.source;
		}
		spell.source = source;

		if(entity.typeId == "amw:summon_placeholder"){
			system.runTimeout( () => {
				modifier.spell.id(entity, spell);
			}, 2);
		}else{
			modifier.spell.id(entity, spell);
		}
		
	}
}

export function setScale(source, modifier){
	if(!source.hasComponent("minecraft:scale")) return;
	source.getComponent("minecraft:scale").value = modifier.scale;
}

export function summonAtLocation(source, modifier){
	let loc = source.location;
	if(modifier.offset != undefined){
		loc = Vector.add(loc, modifier.offset);
	}
	if(modifier.do_not_spawn_at_actor && Vector.distance(modifier.actor.location, loc) < 1.5) return;

	if(modifier.round_location != undefined && modifier.round_location){
		loc.x = Math.round(loc.x) - 0.5;
		loc.z = Math.round(loc.z) + 0.5;
	}

	if(modifier.round_y != undefined && modifier.round_y){
		loc.y = Math.round(loc.y) - 0.5;
	}

	let dimension = source.dimension;
	let entity = dimension.spawnEntity(modifier.type, loc);
	if(entity.hasComponent("minecraft:projectile")){
		let projectile = entity.getComponent("minecraft:projectile");
		if(modifier.owner == "self") projectile.owner = source;
		if(modifier.owner != undefined){
			projectile.owner = modifier[modifier.owner];
		}else{
			projectile.owner = (source.id != -1 ) ?  source : modifier.actor;
		}
		// if(entity.typeId == "amw:summon_placeholder"){
		// 	let entity_name = "summoned_magic" + entity.id;
		// 	entity.nameTag = entity_name;
		// 	let run_count = 2;
		// 	let run_check_target_id = system.runInterval(()=>{
		// 		if(!entity.isValid()){
		// 			// console.warn("entity not found, cheking new one!");
		// 			let entity_temp = dimension.getEntities({name: entity_name});
		// 			// console.warn("entity with similar is : " + entity_temp.length)

		// 			if(entity_temp.length > 0){
		// 				entity = entity_temp[0];
		// 				// console.warn("entity found, replacing to new entity!");
		// 				entity.nameTag = "";
		// 				system.clearRun(run_check_target_id);
		// 			}
		// 		}
		// 		if(run_count <= 0){
		// 			if(entity.isValid()) entity.nameTag = "";
		// 			system.clearRun(run_check_target_id);
		// 		}
		// 		run_count--;
		// 	});
		// }
	}else{
		if(modifier.copy_rotation == undefined || modifier.copy_rotation == true) entity.setRotation(source.getRotation());
			
		if(entity.hasComponent("minecraft:tameable")){
			let tame = source;
			if(modifier.owner == "self") tame = source;
			if(modifier.owner != undefined){
				tame = modifier[modifier.owner];
			}else{
				tame = (source.id != -1 ) ?  source : modifier.actor;
			}
			entity.getComponent("minecraft:tameable").tame(tame);
		}
	}
	if(modifier.despawn != undefined){
		system.runTimeout( () => {
			try{
				entity.remove();
			}catch(err){}
		}, modifier.despawn);
	}
	if(Vector.distance(loc, entity.location) > 0.1){
		entity.teleport(loc)
	}

	if(modifier.spell != undefined && entity != undefined){
		let spell = modifier.spell.modifier;
		spell.actor = modifier.actor;
		spell.item = modifier.item;
		if(modifier.source_target == undefined || modifier.source_target == "self"){
			spell.source = source;
		}else if(modifier.source_target == "summon"){
			spell.source = entity;
		}else if(modifier.source_target == "source"){
			spell.source = modifier.source;
		}
		spell.source = source;
		
		if(entity.typeId == "amw:summon_placeholder"){
			system.runTimeout( () => {
				modifier.spell.id(entity, spell);
			}, 2);
		}else{
			modifier.spell.id(entity, spell);
		}
	}
}

export function setCameraShake(source, modifier){
	let location;
	try{
		location = source.location;
	}catch(err){
		return;
	}

	let radius = (modifier.radius == undefined) ? 16 : modifier.radius;
	let type = (modifier.type == undefined) ? "rotational" : (modifier.type + "al");

	let duration_data = (modifier.duration == undefined) ? 1 : modifier.duration;
	
	let duration = duration_data;
	let max_duration = duration_data;

	let runId = system.runInterval(()=> {
		try{
			for(let playerData of source.dimension.getEntities({type: "minecraft:player", location: location, maxDistance: radius})){
				let distance = (1-(Vector.distance(playerData.location, location) / radius)) * 4;
				if(modifier.strength != undefined) distance *= modifier.strength;
				if(distance > 4) distance = 4;
				
				playerData.runCommand("camerashake add @s " + (distance * (duration/max_duration)) + " 0.05 " + type);
			}
		}catch(err){
			system.clearRun(runId);
		}
		duration--;
	});

	system.runTimeout(()=> {
		system.clearRun(runId);
	}, duration_data);
}

export function setEntityOwner(source, modifier){
	source.triggerEvent(modifier.trigger_name + player_cast_id[modifier.actor.id]);
}

export function lookAtVelocity(source, modifier){
	let view = source.getVelocity();
	if(modifier.inverse){
		view = Vector.multiply(view, -1);
	}
	let x = Math.atan2(-view.y, Math.sqrt(view.x * view.x + view.z * view.z))* 180 / Math.PI;
	let y = -Math.atan2(-view.x, -view.z)* 180 / Math.PI + 180;
	if(y > 180) y = -(360 - y);
	source.setRotation({ x: x, y: y });
}

export function setEntityTarget(source, modifier){
	// console.warn("a")
	let name = (modifier.name == undefined) ? "spell_target" : modifier.name;
	let tag_name = name + "." + player_cast_id[modifier.actor.id];
	source.addTag(tag_name);
	let duration = (modifier.duration == undefined) ? 100 : modifier.duration;
	system.runTimeout( () => {
		try{
			source.removeTag(tag_name);
		}catch(err){}
	}, duration);
}

export function bouncingMovement(source, modifier){
	let vel = source.getVelocity();
	source.applyKnockback(0, 0, 0, source.isJumping ? Math.abs(vel.y) + 0.2: 0.03);
	source.addEffect("slow_falling", 1, { showParticles: false });
}

export function setKnockbackToTarget(source, modifier){
	try{
		if(source.id == -1) return;
	}catch(err){
		return;
	}
	let direction;
	let ancor_location;
	if(modifier.target != undefined && modifier.target == "self"){
		direction = new Vector(0, 0, 0);
		if(modifier.offset != undefined) direction = Vector.add(direction, modifier.offset);

	}else if(modifier.target == "view"){
		direction = source.getViewDirection();
		direction = new Vector(direction.x, direction.y, direction.z);
		if(modifier.offset != undefined) direction = Vector.add(direction, modifier.offset);

	}else if(modifier.target == "velocity"){
		direction = source.getVelocity();
		direction = new Vector(direction.x, direction.y, direction.z);
		if(modifier.offset != undefined) direction = Vector.add(direction, modifier.offset);

	}else{
		if(modifier.target == undefined || modifier.target == "source"){
			ancor_location = modifier.source.location;
		}else if(modifier.target == "actor"){
			ancor_location = modifier.actor.location;
		}
		if(modifier.offset != undefined) ancor_location = Vector.add(ancor_location, modifier.offset);
		direction = Vector.subtract(ancor_location, source.location);
	}

	if(modifier.deadzone != undefined && Vector.getLength(direction) < modifier.deadzone) return;

	if(modifier.target != "view" && modifier.target != "velocity") direction = Vector.divide(direction, (Vector.getLength(direction)+0.1));
	
	if(modifier.strength) direction = Vector.multiply(direction, modifier.strength);

	if(modifier.inverse) direction = Vector.multiply(direction, -1);
	
	if(modifier.multiplier != undefined) direction = Vector.multiply(direction, modifier.multiplier);


	try{
		if(source.hasComponent("minecraft:projectile")){
			source.getComponent("minecraft:projectile").shoot(direction);
		}else{
			source.applyKnockback(direction.x, direction.z, Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.z, 2)), direction.y);
		}
	}catch(err){
		try{
			source.applyImpulse(direction);
		}catch(err){

		}
	}
	if(modifier.remove_fall_damage) source.addEffect("slow_falling", 1, { amplifier: 1, showParticles: false });
}

export function tentacleEffect(source, modifier){
	if(source.isJumping) source.applyKnockback(0, 0, 0, -2);
	if(source.getEffect("weakness") == undefined) source.addEffect("weakness", 60, { amplifier: modifier.strength, showParticles: false });
	if(source.getEffect("wither") == undefined) source.addEffect("wither", 60, { amplifier: modifier.strength, showParticles: false });
	if(source.getEffect("slowness") == undefined) source.addEffect("slowness", 60, { amplifier: modifier.strength, showParticles: false });
	if(source.getEffect("blindness") == undefined) source.addEffect("blindness", 60, { amplifier: modifier.strength, showParticles: false });

	source.dimension.spawnParticle("magic:dark_magic_cast_impact", source.location, particleMap);
}

export function toxicEffect(source, modifier){
	if(source.getEffect("poison") == undefined) source.addEffect("poison", 600, { amplifier: modifier.strength, showParticles: true });
	if(source.getEffect("nausea") == undefined) source.addEffect("nausea", 600, { amplifier: modifier.strength, showParticles: false });
	if(source.getEffect("slowness") == undefined) source.addEffect("slowness", 600, { amplifier: modifier.strength, showParticles: false });

//	source.dimension.spawnParticle("magic:dark_magic_cast_impact", source.location, particleMap);
}

export function windBlows(source, modifier){
	let view = modifier.actor.getViewDirection();
	view.y *= modifier.power;
	source.dimension.spawnParticle("magic:wind_magic_effect", source.getHeadLocation(), particleMap);
	if(source.id == modifier.actor.id){
		modifier.actor.applyKnockback(-view.x, -view.z, modifier.power, -view.y);
		return;
	}
	try{
		source.applyKnockback(view.x, view.z, modifier.power, view.y);
	}catch(err){
		source.applyImpulse(Vector.multiply(view, modifier.power));
	}
}

export function decoyObelisk(source, modifier){
	let location = source.dimension.getBlockFromRay(source.location, {x: 0, y: -1, z: 0}).block.location;
	location.x += 0.5
	location.z += 0.5
	location.y += 1;
	let summon = source.dimension.spawnEntity("amw:decoy_obelisk", location);
	let dimension = source.dimension;
	let id_temp = [];
	system.runTimeout(() => {
		let run_id = system.runInterval(() => {
			if(source == undefined){
				system.clearRun(run_id);
				return;
			}
			try{
				for(let entity of dimension.getEntities({location: location, maxDistance: 6, minDistance: 0.5, excludeFamilies: [ "magic" ]})){
					if(summon.id ==  entity.id || modifier.actor.id == entity.id || entity.typeId == "minecraft:item") continue;
					dimension.spawnParticle("magic:earth_magic_cast_impact", entity.location, particleMap);

					if(id_temp.includes(entity.id)) continue;
					id_temp.push(entity.id);
					if(entity.target && entity.target.id == summon.id) continue;
					entity.applyDamage(0.01, { cause: "magic", damagingEntity: summon });
				}
			}catch(err){
				system.clearRun(run_id);
			}		
		});
	}, 20);
	source.dimension.spawnParticle("magic:earth_magic_cast_impact", location, particleMap);
}

export function distanceTarget(source, modifier){
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: source
	}
	let filter;
	if(isNaN(modifier.distance)){
		var distance = modifier.distance;
		let size = {
			x: distance.x-1,
			y: distance.y-1,
			z: distance.z-1
		};
		let loc = Vector.subtract(source.location, Vector.divide(distance, 2));

		filter = {
			location: loc,
			volume: size
		};
	}else{
		filter = {
			location: source.location,
			maxDistance: modifier.distance
		};
	}
	if(modifier.exclude_families == undefined){
		filter.excludeFamilies = [ "magic" ]
	}else if(modifier.exclude_families == "none"){
	}else{
		filter.excludeFamilies = modifier.exclude_families;
		filter.excludeFamilies.push("magic");
	}

	if(modifier.offset != undefined){
		filter.location = Vector.add(filter.location, modifier.offset);
	}

	if(modifier.tags != undefined) filter.tags = modifier.tags;
	if(modifier.type != undefined) filter.type = modifier.type;
	if(modifier.families != undefined) filter.families = modifier.families;
	if(modifier.deadzone != undefined){
		filter.minDistance = modifier.deadzone;
	}

	let scan_count = 0;
	
	for(let entity of source.dimension.getEntities(filter)){
		if(modifier.count != undefined && scan_count >= modifier.count - 1) break;
		if(modifier.exclude_families != "none" && (entity.typeId == "minecraft:item" || entity.typeId == "minecraft:xp_orb" || entity.hasComponent("minecraft:projectile"))) continue;
		if(!modifier.include_actor && modifier.actor.id == entity.id) continue;
		if(!modifier.include_source && source.id == entity.id) continue;
		
		modifier.impact.id(entity, Object.assign(modifier.impact.modifier, spell_modifier));
		scan_count++;
		if(modifier.single_scan) break;
	}
	if(modifier.empty_spell != undefined && scan_count == 0){
		modifier.empty_spell.id(source, Object.assign(modifier.empty_spell.modifier, spell_modifier));
	}
}

export function levitate(source, modifier){
	let temp_location = source.location;

	let run_id = system.runInterval(() => {
		try{
			if(source == undefined){
				system.clearRun(run_id);
				return;
			}
			if(source.location.y < temp_location.y + modifier.height){
					source.applyKnockback(0, 0, 0, 0.4);
					source.dimension.spawnParticle("magic:light_magic_cast_impact", source.location, particleMap);
					source.dimension.spawnParticle("magic:wind_magic_effect", source.location, particleMap);
				
			}
		}catch(err){
			system.clearRun(run_id);
		}
	});
	system.runTimeout(() => {
		system.clearRun(run_id);
	}, modifier.duration);
}

export function thunderStreak(source, modifier){
	let from = modifier.source;
	if(modifier.from != undefined) from = modifier[modifier.from];
	let location_source = from.getHeadLocation();
	if(modifier.offset != undefined) location_source = Vector.add(location_source, modifier.offset);
	let location_target = source.location;
	location_target.y += 1;
	let dimension = source.dimension;
	let thunder = dimension.spawnEntity("amw:thunder_effect", location_source);
	thunder.teleport(location_source, {facingLocation: location_target});
//	let dist_calc = Math.max(Math.sqrt(Math.pow(dist.x, 2) + Math.pow(dist.y, 2) + Math.pow(dist.z, 2)), 1)/8;
	try{
		source.applyDamage(modifier.strength, { cause: "magic", damagingEntity: modifier.actor });
		dimension.spawnParticle("magic:thunder_effect", source.getHeadLocation());
	}catch(err){}
//	thunder.getComponent("minecraft:scale").value = 0.1;
}

export function setupVoodoo(source, modifier){
	setupVoodooId[modifier.actor.id] = source;
}

export function setupSingleScan(source, modifier){
	let id = modifier.actor.id;
	if(single_scan_id[id] == undefined) single_scan_id[id] = {};
	if(remove_single_scan_id[id] == undefined) remove_single_scan_id[id] = {};
	if(timeout_single_scan_time[id] == undefined) timeout_single_scan_time[id] = {};
	let cluster = (modifier.cluster_name == undefined) ? "default" : modifier.cluster_name;
	if(single_scan_id[id][cluster] == undefined){
		single_scan_id[id][cluster] = [];
	}
	timeout_single_scan_time[id][cluster] = {};

	if(modifier.restart_cluster == true || modifier.restart_cluster == undefined){
		if(single_scan_id[id][cluster] != undefined){
			while(single_scan_id[id][cluster].length > 0) {
				single_scan_id[id][cluster].pop();
			}
		}
		if(modifier.duration != undefined){
			remove_single_scan_id[id][cluster] = system.currentTick + modifier.duration;
		}
	}
}

export function addSingleScan(source, modifier){
	let id = modifier.actor.id;
	let source_id = source.id;
	let cluster = (modifier.cluster_name == undefined) ? "default" : modifier.cluster_name;
	if(timeout_single_scan_time[id][cluster][source_id] == undefined) single_scan_id[id][cluster].push(source_id);
	
	if(modifier.duration != undefined){
		if(timeout_single_scan_time[id][cluster][source_id] != undefined){
			system.clearRun(timeout_single_scan_time[id][cluster][source_id]);
		}
		timeout_single_scan_time[id][cluster][source_id] = system.runTimeout(()=>{
			single_scan_id[id][cluster].pop(source_id);
			delete timeout_single_scan_time[id][cluster][source_id];
		}, modifier.duration);
	}
}

export function addSingleScanEntity(source, modifier){
	let id = modifier.actor.id;
	let cluster = (modifier.cluster_name == undefined) ? "default" : modifier.cluster_name;
	if(timeout_single_scan_time[id][cluster][source.id] == undefined) single_scan_id[id][cluster].push(source);

	
	if(modifier.duration != undefined){
		if(timeout_single_scan_time[id][cluster][source.id] != undefined){
			system.clearRun(timeout_single_scan_time[id][cluster][source.id]);
		}
		timeout_single_scan_time[id][cluster][source.id] = system.runTimeout(()=>{
			single_scan_id[id][cluster].pop(source);
			delete timeout_single_scan_time[id][cluster][source.id];
		}, modifier.duration);
	}
}

export function removeSingleScan(source, modifier){
	let id = modifier.actor.id;
	let source_id = source.id;
	let cluster = (modifier.cluster_name == undefined) ? "default" : modifier.cluster_name;
	single_scan_id[id][cluster].pop(source_id);
}

export function removeSingleScanEntity(source, modifier){
	let id = modifier.actor.id;
	let cluster = (modifier.cluster_name == undefined) ? "default" : modifier.cluster_name;
	single_scan_id[id][cluster].pop(source);
}

export function castAtScanEntity(source, modifier){
	let cluster = (modifier.cluster_name == undefined) ? "default" : modifier.cluster_name;
	let scan = single_scan_id[modifier.actor.id][cluster];
	let source_modifier = source;
	if(modifier.from != undefined && modifier.from != "self") source_modifier = modifier[modifier.from];
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: source_modifier
	};
	if(modifier.spell != undefined){
		let length = scan.length;
		let count = 0;
		for(let entity of scan){
			if(count > length) break;
			count++;
			if(typeof entity === 'string') continue;
			modifier.spell.id(entity, Object.assign(modifier.spell.modifier, spell_modifier));
		}
	}
	if(modifier.empty_spell != undefined && (scan == undefined || scan.length == 0)){
		modifier.empty_spell.id(source, Object.assign(modifier.empty_spell.modifier, spell_modifier));
	}
}

export function instantKill(source, modifier){
	source.kill();
}

export function teleportToTarget(source, modifier){
	let location;
	let data = {};
	if(modifier.target == undefined){
		location = modifier.source.location;
		if(modifier.head_location) location = modifier.source.getHeadLocation();
		if(modifier.use_rotation == undefined || modifier.use_rotation == true) data.rotation = modifier.source.getRotation();
	}else{
		location = modifier[modifier.target].location;
		if(modifier.head_location) location = modifier[modifier.target].getHeadLocation();
		if(modifier.use_rotation == undefined || modifier.use_rotation == true) data.rotation = modifier[modifier.target].getRotation();
	}
	if(modifier.offset != undefined) location = Vector.add(location, modifier.offset);

	source.teleport(location, data);
}

export function setAttributeTarget(source, modifier){
	let attributes = [];
	let duration = (modifier.duration == undefined) ? 20 : modifier.duration;
	let rotation = source.getRotation();

	for(let data of modifier.attributes){
		let component = source.getComponent(data.type);
		let default_value = component.defaultValue;
		if(data.multiply != undefined) default_value *= data.multiply;
		if(data.add != undefined) default_value *= data.add;
		attributes.push([component, default_value]);
	}

	if(duration > 0){
		let runId = system.runInterval(()=>{
			try{
				for(let data of attributes){
					data[0].setCurrentValue(data[1]);
				}
				if(modifier.prevent_jump && source.isJumping) source.applyKnockback(0, 0, 0, -5);
				if(modifier.immobilize){
					if(source.typeId == "minecraft:player"){
						source.inputPermissions.movementEnabled = false;
						source.inputPermissions.cameraEnabled = false;
					}else{
						source.applyKnockback(0, 0, 0, -0.2);
					}
				}
				if(modifier.prevent_rotation) source.setRotation(rotation);
			}catch(err){
				system.clearRun(runId);
			}
		});
		source.addTag("amw:change_attributes");
	
		system.runTimeout(()=>{
			try{
				for(let data of attributes){
					data[0].resetToDefaultValue();
				}

				if(modifier.immobilize && source.typeId == "minecraft:player"){
					source.inputPermissions.movementEnabled = true;
					source.inputPermissions.cameraEnabled = true;
				}
			}catch(err){}

			system.clearRun(runId);
			if(source.isValid()) source.removeTag("amw:change_attributes");
		}, duration);
	}else{
		for(let data of attributes){
			data[0].setCurrentValue(data[1]);
		}
		if(modifier.prevent_jump && source.isJumping) source.applyKnockback(0, 0, 0, -5);
		if(modifier.immobilize){
			if(source.typeId == "minecraft:player"){
				source.inputPermissions.movementEnabled = false;
				source.inputPermissions.cameraEnabled = false;
			}else{
				source.applyKnockback(0, 0, 0, -0.2);
			}
		}
		if(modifier.prevent_rotation) source.setRotation(rotation);
	}
	
}

export function sourceTest(source, modifier){
	if(modifier.tags != undefined){
		let tags = source.getTags();
		if(!tags.includes(modifier.tags)) return;
	}

	if(modifier.velocity != undefined){
		let velocity = source.getVelocity();
		velocity = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2) + Math.pow(velocity.z, 2));
			// console.warn(velocity)
		if(modifier.velocity.operator == ">"){
			if(velocity < modifier.velocity.value) return;
		}else if(modifier.velocity.operator == ">="){
			if(velocity <= modifier.velocity.value) return;
		}else if(modifier.velocity.operator == "<"){
			if(velocity > modifier.velocity.value) return;
		}else if(modifier.velocity.operator == "<="){
			if(velocity >= modifier.velocity.value) return;
		}else if(modifier.velocity.operator == "=="){
			if(velocity != modifier.velocity.value) return;
		}else{
			return;
		}
	}

	if(modifier.type != undefined){
		if(!modifier.type.includes(source.typeId)) return;
	}

	if(modifier.exclude_types != undefined){
		if(modifier.exclude_types.includes(source.typeId)) return;
	}
	
	if(modifier.is_entity != undefined){
		if((world.getEntity(source.id) != undefined) != modifier.is_entity) return;
	}

	if(modifier.single_scan != undefined){
		let id = modifier.actor.id;
		if (typeof modifier.single_scan.cluster_name === 'string'){
			let cluster = (modifier.single_scan.cluster_name == undefined) ? "default" : modifier.single_scan.cluster_name;
			
			if(single_scan_id[id][cluster].includes(source.id)) return;
		}else{
			let data = modifier.single_scan;
			if(data.include != undefined){
				let include_pass = false;
				let type = 0;
				if(data.include.type != undefined) type = (data.include.type == "all") ? 1 : 0;
				if(type == 0) {
					for(let scan_id of data.include.name){
						if(single_scan_id[id][scan_id].includes(source.id)){
							include_pass = true;
							break;
						}
					}
				}else if(type == 1){
					include_pass = data.includes.length;
					for(let scan_id of data.include.name){
						if(single_scan_id[id][scan_id].includes(source.id)){
							include_pass = include_pass - 1;
						}
					}
					include_pass = (include_pass == 0);
				}
				if(include_pass) return;
			}
			if(data.exclude != undefined){
				let exclude_pass = true;
				let type = 0;
				if(data.exclude.type != undefined) type = (data.exclude.type == "all") ? 1 : 0;
				if(type == 0) {
					for(let scan_id of data.exclude.name){
						if(single_scan_id[id][scan_id].includes(source.id)){
							exclude_pass = false;
							break;
						}
					}
				}else if(type == 1){
					exclude_pass = data.excludes.length;
					for(let scan_id of data.exclude.name){
						if(single_scan_id[id][scan_id].includes(source.id)){
							exclude_pass = exclude_pass - 1;
							break;
						}
					}
					exclude_pass = (exclude_pass > 0);
				}
				if(exclude_pass) return;
			}
		}
	}
	
	if(modifier.on_fire != undefined){
		try{
			let fire_tick = source.getComponent("minecraft:onfire").onFireTicksRemaining;
			if(fire_tick > 0 != modifier.on_fire) return;
		}catch(err){
			if(modifier.on_fire) return;
		}
		
	}
	
	if(modifier.is_jumping != undefined){
		if(source.isJumping != modifier.is_jumping) return;
	}
	
	if(modifier.is_sneaking != undefined){
		if(source.isSneaking != modifier.is_sneaking) return;
	}
	if(modifier.is_in_water != undefined){
		if(source.isInWater != modifier.is_in_water) return;
	}
	
	if(modifier.is_swimming != undefined){
		if(source.isSwimming != modifier.is_swimming) return;
	}

	if(source.typeId == "minecraft:player" && modifier.is_pressing_jumping != undefined){
		if(player_press_jump[source.id] != modifier.is_pressing_jumping) return;
	}
	
	if(modifier.is_on_ground != undefined){
		if(source.isOnGround != modifier.is_on_ground) return;
	}
	
	if(modifier.exclude_families != undefined){
		if(source.matches({excludeFamilies: modifier.exclude_families}) == false) return;
	}

	if(modifier.target != undefined){
		if(source.target == undefined) return;
		if(modifier.target == "actor"){
			if(source.target.id != modifier.actor.id) return;
		}else{
			if(!modifier.target.includes(source.typeId)) return;
		}
	}

	if(modifier.summon_target != undefined){
		let name = (modifier.summon_target.name == undefined) ? "spell_target" : modifier.summon_target.name;
		let tag_name = name + "." + player_cast_id[modifier.actor.id];
		if(source.hasTag(tag_name) && !modifier.summon_target.value) return;
		if(!source.hasTag(tag_name) && modifier.summon_target.value) return;
	}

	if(modifier.health != undefined){
		let health;
		try{
			health = source.getComponent("minecraft:health").currentValue;
		}catch(err){
			return;
		}
		if(modifier.health.in_percent) health = health / source.getComponent("minecraft:health").defaultValue * 100;

		if(modifier.health.operator == ">"){
			if(health < modifier.health.value) return;
		}else if(modifier.health.operator == ">="){
			if(health <= modifier.health.value) return;
		}else if(modifier.health.operator == "<"){
			if(health > modifier.health.value) return;
		}else if(modifier.health.operator == "<="){
			if(health >= modifier.health.value) return;
		}else if(modifier.health.operator == "=="){
			if(health != modifier.health.value) return;
		}else{
			if(health > modifier.health.value) return;
		}
	}

	if(modifier.blocking != undefined){
		let dist = {
			maxDistance: modifier.blocking.value + 4
		}
		
		let blocking = source.getEntitiesFromViewDirection(dist);
		if(blocking.length > 0){
			blocking = estimated_location[0].distance;
		}else{
			blocking = source.getBlockFromViewDirection(dist);
			if(blocking != undefined){
				blocking = Vector.distance(source.getHeadLocation(), Vector.add(blocking.block.location, blocking.faceLocation));
			}else{
				blocking = modifier.blocking.value + 4;
			}
		}

		if(modifier.blocking.operator == ">"){
			if(blocking < modifier.blocking.value) return;
		}else if(modifier.blocking.operator == ">="){
			if(blocking <= modifier.blocking.value) return;
		}else if(modifier.blocking.operator == "<"){
			if(blocking > modifier.blocking.value) return;
		}else if(modifier.blocking.operator == "<="){
			if(blocking >= modifier.blocking.value) return;
		}else if(modifier.blocking.operator == "=="){
			if(blocking != modifier.blocking.value) return;
		}else{
			if(blocking > modifier.blocking.value) return;
		}
	}

	if(modifier.spell != undefined){
		modifier.spell.modifier.actor = modifier.actor;
		modifier.spell.modifier.item = modifier.item;
		modifier.spell.modifier.source = modifier.source;
		modifier.spell.id(source, modifier.spell.modifier);
	}
}

export function castAtSource(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = source;
	modifier.spell.id(modifier.source, modifier.spell.modifier);
}

export function castAtActor(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = modifier.passthru_source ? modifier.source : source;
	modifier.spell.id(modifier.actor, modifier.spell.modifier);
}

export function castAtTarget(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = modifier.actor;
	modifier.spell.id(modifier[modifier.target], modifier.spell.modifier);
}

export function summonVoodooTarget(source, modifier){
	if(setupVoodooId[modifier.actor.id] == undefined) return;
	let target = setupVoodooId[modifier.actor.id];
	
	if(modifier.spell != undefined){
		modifier.spell.modifier.actor = modifier.actor;
		modifier.spell.modifier.item = modifier.item;
		modifier.spell.modifier.source = target;
	}

	let entity = source.dimension.spawnEntity("amw:voodoo", source.location);
	entity.teleport(source.location, {rotation: source.getRotation()});
	let duration = (modifier.duration == undefined) ? 300 : modifier.duration;

	let effectId = world.afterEvents.effectAdd.subscribe( s => {
		try{
			target.addEffect(s.effect.typeId, s.effect.duration, { amplifier: s.effect.amplifier})
		}catch(err){
			world.afterEvents.effectAdd.unsubscribe(effectId);
		}
	}, { entities: [ entity ]});

	let hitId = world.afterEvents.entityHurt.subscribe( s => {
		try{
			entity.getComponent("minecraft:health").setCurrentValue(100);
			target.applyDamage(s.damage * modifier.strength, {damagingEntity: s.damageSource.damagingEntity, cause: s.damageSource.cause});
			target.dimension.spawnParticle("magic:dark_magic_cast_impact", target.location, particleMap);
		}catch(err){
			entity.remove();
			world.afterEvents.entityHurt.unsubscribe(hitId);
			world.afterEvents.effectAdd.unsubscribe(effectId);
		}
		
	}, { entities: [ entity ]});

	if(modifier.spell != undefined) modifier.spell.id(entity, modifier.spell.modifier);

	system.runTimeout(() => {
		try{
		entity.remove();
		}catch(err){}

		world.afterEvents.entityHurt.unsubscribe(hitId);
		world.afterEvents.effectAdd.unsubscribe(effectId);
	}, duration);

	delete setupVoodooId[modifier.actor.id];
}

export function teleport(source, modifier){
	if(modifier.actor == undefined) return;
	let from = modifier.actor;
	let to = source;
	if(modifier.from != undefined && modifier.from != "self" ) from = modifier[modifier.from];
	if(modifier.to != undefined && modifier.from != "self" ) to = modifier[modifier.to];

	if(modifier.from == "self" ) from = source;
	if(modifier.from == "self" ) to = source;

	if(from.id == to.id) return;

	let rot = from.getRotation();
	let location = to.location;
	location.y += 1;
	location.x += 0.5;
	location.z += 0.5;
	from.teleport(location);
	system.runTimeout(() => {
		to.dimension.spawnParticle("magic:void_magic_cast_impact", location, particleMap);
	}, 1);
}

export function swapLocation(source, modifier){
	let from = source;
	let to = modifier.source;
	if(modifier.from != undefined && modifier.from != "self" ) from = modifier[modifier.from];
	if(modifier.to != undefined && modifier.to != "self" ) to = modifier[modifier.to];

	if(modifier.from == "self" ) from = source;
	if(modifier.to == "self" ) to = source;

	if(from.id == to.id) return;

	let rot = modifier.actor.getRotation();
	let location_from = from.location;
	let location_to = to.location;
	from.teleport(location_to);
	to.teleport(location_from);

	source.dimension.spawnParticle("magic:void_magic_cast_impact", location_from, particleMap);
	source.dimension.spawnParticle("magic:void_magic_cast_impact", location_to, particleMap);
}

export function bubbleTrap(source, modifier){
	if(modifier.actor == undefined) return;
	let dimension = source.dimension;
	let summon = dimension.spawnEntity("amw:bubble_trap", source.location);
	let duration = modifier.duration;
	let err = false;
	let run_id = system.runInterval(() => {
		if(err || duration == 0){
			summon.remove();
			system.clearRun(run_id);
		}
		try{
			let loc = source.location;
			loc.y += 1;
			source.applyKnockback(0, 0, 0, 0.05);
			let rot = source.getRotation();
			summon.teleport(loc, {rotation: rot});
		}catch(err){
			err = true;
		}
		duration--;
	});
}

export function lightBeam(source, modifier){
	if(modifier.actor == undefined) return;

	let location = source.location;
	location.y += 0.5;

	let actor_loc = modifier.source.getHeadLocation();
	let player_view = modifier.source.getViewDirection();
	let dist = Math.sqrt(Math.pow(actor_loc.x - location.x, 2) + Math.pow(actor_loc.y - location.y, 2) + Math.pow(actor_loc.z - location.z, 2));
	dist = Math.max(dist-1, 0);
	let dir_map = new MolangVariableMap();
	dir_map.setSpeedAndDirection("variable.direction_script", dist, new Vector(player_view.x, player_view.y, player_view.z));
	source.dimension.spawnParticle("magic:light_beam_effect", actor_loc, dir_map);
	try{
		source.applyDamage(modifier.strength, { cause: "magic", damagingEntity: modifier.actor });
		source.dimension.spawnParticle("magic:light_effect", source.getHeadLocation());
	}catch(err){}
}

export function createParticleSourceToTarget(source, modifier){
	let source_loc = source.getHeadLocation();
	let source_view = source.getViewDirection();
	if(modifier.start_distance != undefined) source_loc = Vector.add(source_loc, Vector.multiply(source_view, modifier.start_distance));
	let dist = modifier.distance;
	let dir_map = new MolangVariableMap();
	dir_map.setSpeedAndDirection("variable.direction_script", dist, new Vector(source_view.x, source_view.y, source_view.z));
	source.dimension.spawnParticle(modifier.particle, source_loc, dir_map);
}

export function blessing(source, modifier){
	let blessing_list = [
		"absorption",
		"conduit_power",
		"fire_besistance",
		"haste",
		"jump_boost",
		"night_vision",
		"resistance",
		"speed",
		"strength",
		"water_breathing"
	];
	let random_effect = blessing_list[Math.floor(Math.random()*blessing_list.length)];
	source.addEffect(random_effect, modifier.duration, { amplifier: modifier.strength, showParticles: false });
	let run_id = system.runInterval(() => {
		if(source == undefined) system.clearRun(run_id);
		source.dimension.spawnParticle("magic:light_magic_cast_impact", source.location, particleMap);
	});
	system.runTimeout(() => {
		system.clearRun(run_id);
	}, modifier.duration);

}

export function swirl(source, modifier){
	let particle_loc = source.location;
	particle_loc.y += 1.5;
	source.dimension.spawnParticle("magic:earth_magic_cast_impact", particle_loc, particleMap);
	for(let target of source.dimension.getEntities({location: source.location, maxDistance: 3})){
		if(target.id == source.id || target.id == modifier.actor.id ) continue;
		try{
			target.applyKnockback(0, 0, 0, 1);
		}catch(err){}
	}
}

export function setElectrocute(source, modifier){
	//bikin dia kena listrik (bisa sesuai durasai)
}

export function setFreeze(source, modifier){
	if(source.id == -1) return;
	if(system.currentTick <= has_freeze[source.id]) return;
	let type = (modifier.type) ? modifier.type : "slow";
	let duration = (modifier.duration) ? modifier.duration: 1;
	let strength = (modifier.strength) ? modifier.strength: 0;
	has_freeze[source.id] = system.currentTick + duration;

	if(type == "slow"){
		source.addEffect("slowness", duration, { amplifier: strength, showParticles: false });
		let run_id = system.runInterval(()=>{
			if(!source.isValid() || actor_dead.includes(source.id) || duration <= 0){
				system.clearRun(run_id);
				return;
			};
			source.playAnimation("animation.humanoid.magic.freezing", {
				blendOutTime: 0.25,
				controller: "freezing"
			});

			duration--;
		})
	}else if(type == "stunt"){
		let effect = source.dimension.spawnEntity("amw:freeze_effect", source.location);
		let temp_rotation = source.getRotation();
		let run_id = system.runInterval(()=>{
			if(!source.isValid() || actor_dead.includes(source.id) || duration <= 0){
				system.clearRun(run_id);
				if(source.typeId == "minecraft:player"){
					source.inputPermissions.movementEnabled = true;
					source.inputPermissions.cameraEnabled = true;
				}
				effect.remove();
				return;
			};
			if(source.isOnGround){
				source.teleport(effect.location, { rotation: temp_rotation });
			}else{
				source.applyKnockback(0, 0, 0, -0.5);
				effect.teleport(source.location);
			}
			
			if(system.currentTick % 40) source.applyDamage(strength + 1, {
				cause: "magic"
			});
			duration--;
		})
		if(source.typeId == "minecraft:player"){
			source.inputPermissions.movementEnabled = false;
			source.inputPermissions.cameraEnabled = false;
		}else{
			source.addEffect("weakness", duration, { amplifier: 255, showParticles: false });
		}
	}
}

export function setFire(source, modifier){
	if(!source.hasComponent("minecraft:onfire")) source.applyDamage(modifier.strength / 3, { cause: "fire"});
	source.setOnFire(modifier.strength, true);
}

export function addMount(source, modifier){
	let mount_type = " summon_ride ";
	if(modifier.mount_type == "rider") mount_type = " summon_rider ";
	let entity = source.dimension.spawnEntity(modifier.type, source.location);
	if(entity == undefined){
		source.runCommand("ride " + source.nameTag + mount_type + modifier.type);
	}else{
		let ride_id = "ride_id" + (parseInt(Math.random() * 1080) + source.id);
		if(modifier.mount_type == "ride" || !modifier.mount_type){
			entity.setRotation(source.getRotation());
			entity.addTag(ride_id)
			source.runCommand("ride @s start_riding @e[tag=" + ride_id + "]");
			entity.removeTag(ride_id)
		}else if(modifier.mount_type == "rider"){
			source.setRotation(entity.getRotation());
			source.addTag(ride_id)
			entity.runCommand("ride @s start_riding @e[tag=" + ride_id + "]");
			source.removeTag(ride_id)
		}

		if(modifier.spell){
			const spell_modifier = {
				item: modifier.item,
				actor: modifier.actor,
				source: source
			}

			modifier.spell.id(entity, Object.assign(modifier.spell.modifier, spell_modifier));
		}
	}
}

export function healing(source, modifier){
	if(source.hasComponent("minecraft:health") == false) return;
	let health = source.getComponent("minecraft:health");

	health.setCurrentValue(health.currentValue + modifier.strength);
	if(system.currentTick % 4 == 0) source.addEffect("saturation", 1, { amplifier: 1, showParticles: false });
	source.dimension.spawnParticle("magic:heal_magic_effect", source.location, particleMap);
}

export function purify(source, modifier){
	let detrimental_effect = [
		"bad_omen",
		"blindness",
		"darkness",
		"fatal_poison",
		"hunger",
		"instant_damage",
		"mining_fatigue",
		"nausea",
		"poison",
		"slowness",
		"weakness",
		"wither"
	];
	for(let effect of detrimental_effect){
		if(source.getEffect(effect) == undefined) continue;
		source.addEffect(effect, 1, { amplifier: 1, showParticles: false });
		source.dimension.spawnParticle("magic:light_magic_cast_impact", source.location, particleMap);
	}
}

export function setEffect(source, modifier){
	let particle_data = { amplifier: 1, showParticles: false };
	if(modifier.amplifier != undefined) particle_data.amplifier = modifier.amplifier;
	if(modifier.particle != undefined) particle_data.showParticles = modifier.particle;
	source.addEffect(modifier.effect, modifier.duration, particle_data);
}

export function flight(source, modifier){
	let cooldown = modifier.duration;
	let select_inv = modifier.actor.selectedSlotIndex;
	if(modifier.actor.typeId == "minecraft:player") modifier.actor.onScreenDisplay.setActionBar("Sneak to cancel spell");
	
	let run_id = system.runInterval(() => {
		try{
			if(cooldown == 0 || modifier.actor.isSneaking){
				system.clearRun(run_id);
				modifier.actor.playAnimation("default", {
					controller: "casting"
				});
				setCooldown(modifier.actor.id, 0);
				return;
			}
			let player_view = source.getViewDirection();
			
			let rem = source.isJumping ? 0.1 : 1.0;
			source.applyKnockback(player_view.x * rem, player_view.z * rem, (source.isSneaking ? 0.1 : 1) * rem, player_view.y*(source.isSneaking ? 0.1 : 0.5) * rem);
			source.addEffect("slow_falling", 1, { amplifier: 1, showParticles: false });
		}catch(err){
			system.clearRun(run_id);
			setCooldown(modifier.actor.id, 0);
			return;
		}
		if(modifier.item != undefined) modifier.item.getComponent("minecraft:cooldown").startCooldown(modifier.actor);
		source.dimension.spawnParticle("magic:light_magic_cast_impact", source.location, particleMap);
		source.dimension.spawnParticle("magic:wind_magic_effect", source.location, particleMap);

		
		setCooldown(modifier.actor.id, parseInt(cooldown/modifier.duration*50));

		cooldown--;
		modifier.actor.selectedSlotIndex = select_inv;

		modifier.actor.playAnimation("animation.humanoid.magic.flight", {
			controller: "casting"
		});
	});
}

export function sonicBoom(source, modifier){
	let view  = source.getViewDirection();
	let loc = source.getHeadLocation();
	let dimension = source.dimension;
	let target_list_id = [];
	modifier.actor.runCommand("playsound mob.warden.sonic_boom");
	for(let dist = 1; dist <= modifier.length; dist++){
		let location = loc;
		location.x += view.x * dist;
		location.y += view.y * dist;
		location.z += view.z * dist;

		dimension.spawnParticle("minecraft:sonic_explosion", location, particleMap);

		for(let target of dimension.getEntities({location: location, maxDistance: 4, excludeFamilies: [ "magic" ]})){
			if(modifier.actor.id == target.id || target_list_id.includes(target.id)) continue;
			target_list_id.push(target.id);
			target.applyDamage(modifier.strength, { cause: "magic", damagingEntity: modifier.actor });
		}
	}
}

export function floating(source, modifier){
	let height = (modifier.height == undefined) ? 1 : modifier.height;
	let ancor_location;
	let location = source.location;

	if(modifier.ancor == undefined || modifier.ancor == "terget"){
		if(modifier.source == undefined) throw "cannot find source";
		ancor_location = modifier.source.location; 
	}else if(modifier.ancor == "floor"){
		let block = source.dimension.getBlockFromRay(location, {x: 0, y: -1, z: 0}, modifier.block_option);
		if(block == undefined){
			ancor_location = source.location; 
			ancor_location.y -= 16 + height;
		}else{
			ancor_location = Vector.add(block.block.location, block.faceLocation);
		}
	}

	if(modifier.boost != undefined && modifier.boost > 0){
		if(source.isJumping && location.y < ancor_location.y + height + modifier.boost){
			source.applyKnockback(0, 0, 0, modifier.strength);
		}
	}


	if(location.y < ancor_location.y + height){
		try{
			if(modifier.remove_fall_damage) source.addEffect("slow_falling", 1, { amplifier: 1, showParticles: false });
			source.applyKnockback(0, 0, 0, modifier.strength);
		}catch(err){
			location.y += modifier.strength;
			source.teleport(location);
		}
	}

}

export function poltergeist(source, modifier){
	let cooldown = modifier.duration;
	let actor_loc = modifier.actor.location;
	let target_loc = source.location;
	let dimension = source.dimension;
	let distance = Math.sqrt(Math.pow(actor_loc.x - target_loc.x, 2) + Math.pow(actor_loc.y - target_loc.y, 2) + Math.pow(actor_loc.z - target_loc.z, 2));
	let target_list = [];
	let select_inv = modifier.actor.selectedSlotIndex;
	
	if(modifier.actor.typeId == "minecraft:player") modifier.actor.onScreenDisplay.setActionBar("Sneak to cancel spell");
	
	for(let target of dimension.getEntities({location: source.location, maxDistance: 3, excludeFamilies: [ "magic" ]})){
		if(modifier.actor.id == target.id) continue;
		target_list.push(target);
	}
	if(target_list.length == 0) return;

	let temp_loc = target_loc;
	
	let run_id = system.runInterval(() => {
		try{
			if(cooldown == 0 || modifier.actor.isSneaking){
				system.clearRun(run_id);
				setCooldown(modifier.actor.id, 0);
				return;
			}
			let player_view = modifier.actor.getViewDirection();
			let cast_loc = modifier.actor.getHeadLocation();
			let power = distance;
			player_view.x *= power;
			player_view.y *= power;
			player_view.z *= power;
			cast_loc.x += player_view.x;
			cast_loc.y += player_view.y;
			cast_loc.z += player_view.z;

			let block = source.dimension.getBlock(cast_loc);
			if(block == undefined || block.isAir){
				temp_loc = cast_loc;
			}else{
				cast_loc = temp_loc;
			}
			
			for(let target of target_list){
				let rot = target.getRotation();
				target.teleport(cast_loc, {rotation: rot});
			}
			dimension.spawnParticle("magic:light_magic_cast_impact", cast_loc, particleMap);
			dimension.spawnParticle("magic:light_magic_cast_impact", modifier.actor.location, particleMap);
			createLineSpellParticle(dimension, modifier.actor.getHeadLocation(), cast_loc, 0.72, 0.93, 0.98);
		}catch(err){
			system.clearRun(run_id);
			setCooldown(modifier.actor.id, 0);
		}
		setCooldown(modifier.actor.id, parseInt(cooldown/modifier.duration*50));

		if(modifier.item != undefined) modifier.item.getComponent("minecraft:cooldown").startCooldown(modifier.actor);
		
		modifier.actor.selectedSlotIndex = select_inv;
		cooldown--;
	});
}

export function cancelTargetSpell(source, modifier){
	let target = source;
	if(modifier.target != undefined && modifier.target != "self") target = modifier[modifier.target];
	
	let id = target.id;
	cancel_spell.push(id);

	let time = 20;
	if(modifier.duration != undefined) time = modifier.duration;

	system.runTimeout(()=>{
		cancel_spell.pop(id);
	}, time);
	throw 32;
}

export function stopCast(source, modifier){
	console.warn("stopped cast")
	throw 32;
}

export function skipCast(source, modifier){
	throw 31;
}

export function castCooldown(source, modifier){
	let cooldown = modifier.duration;
	let target = source;
	let cooldown_name = "cast";
	if(modifier.name != undefined) cooldown_name = modifier.name;

	if(modifier.target != undefined) target = modifier[modifier.target];
	if(modifier.target == "self") target = source;

	if(target.typeId != "minecraft:player") return;

	if(modifier.cooldown_spell){
		target.runCommand("scriptevent amw:cooldown " + modifier.cooldown_spell + " " + (system.currentTick + cooldown));
	}else{
		target.startItemCooldown(cooldown_name, cooldown);
	}
}

export function playAnimation(source, modifier){
	let data = {};
	if(modifier.stop_state) data.stopExpression = modifier.stop_state;
	if(modifier.blend) data.blendOutTime = modifier.blend;
	if(modifier.next) data.nextState = modifier.next;
	if(modifier.controller){
		data.controller = modifier.controller;
	}else{
		data.controller = "animation" + (system.currentTick - source.id);
	}

	if(modifier.show_to != undefined) switch(modifier.show_to){
		case "self":
			if(source.typeId == "minecraft:player") data.players = [ source.name ]
			break;
		case "all":
			break;
		case "except_self":
			data.players = [];
			for(let playerData of source.dimension.getPlayers()){
				if(source.typeId == "minecraft:player" && playerData.id == source.id) continue;
				data.players.push(playerData.name)
			}
			break;
		case "except_actor":
			data.players = [];
			for(let playerData of source.dimension.getPlayers()){
				if(modifier.actor.typeId == "minecraft:player" && playerData.id == modifier.actor.id) continue;
				data.players.push(playerData.name);
			}
			break;
		default:
			if(modifier[modifier.show_to].typeId == "minecraft:player") data.players = [ modifier[modifier.show_to].name ]
			break;
	}

	source.playAnimation(modifier.animation, data);
}

export function castWhenCharging(source, modifier){
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: modifier.source
	}

	let type;
	let callback_function = world.afterEvents.itemStartUse;
	let max_duration = 1;
	if(modifier.type) type = modifier.type;
	if(modifier.action_type == "release") callback_function = world.afterEvents.itemReleaseUse;
	if(modifier.duration) max_duration = modifier.duration;
	let duration = max_duration;

	if(source.typeId == "minecraft:player"){
		source.runCommand("scriptevent amw:spell active");
		let id = source.id;
		let is_holding = false;
		let is_used = false;
		let charged_id;
		let not_charged_id;
		let select_inv = modifier.actor.selectedSlotIndex;
		if(modifier.can_cancel == undefined || modifier.can_cancel == true) source.onScreenDisplay.setActionBar("Interact with item to cast spell");
		let error_id;
		let cooldownId = system.runInterval(() =>{
			if(((modifier.actor.isSneaking || cancel_spell.includes(modifier.actor.id)) && (modifier.can_cancel == undefined || modifier.can_cancel == true)) || duration <= 0 || !source.isValid() || actor_dead.includes(source.id)){
				// console.warn("canceled")
				system.clearRun(cooldownId);
				setCooldown(modifier.actor.id, 0);
				if(not_charged_id == undefined){
					callback_function.unsubscribe(charged_id);
				}else{
					world.afterEvents.itemStartUse.unsubscribe(charged_id);
					world.afterEvents.itemReleaseUse.unsubscribe(not_charged_id);
				}
				source.runCommand("scriptevent amw:spell deactive");
				// try{
					if(modifier.stop_spell != undefined && modifier.stop_spell != "spell_deactive"){
						modifier.stop_spell.id(source, Object.assign(modifier.stop_spell.modifier, spell_modifier));
					}
					if(modifier.spell_deactive != undefined && modifier.stop_spell == "spell_deactive"){
						modifier.spell_deactive.id(source, Object.assign(modifier.spell_deactive.modifier, spell_modifier));
					}
				// }catch(err){
				// 	error_id = err;
				// }
				// if(error_id) throw error_id;
				return;
			}
	
			try{
				if(modifier.force_slot == true) modifier.actor.selectedSlotIndex = select_inv;
				source.startItemCooldown(modifier.item.getComponent("minecraft:cooldown").cooldownCategory, 0);
				
				setCooldown(modifier.actor.id, parseInt(duration/max_duration*50));

				if(modifier.action_type == "hold"){
					if(is_holding){
						modifier.spell.id(source, Object.assign(modifier.spell.modifier, spell_modifier));
						if(!modifier.ticking_duration) duration--;
						if(!is_used) is_used = true;
					}else{
						if(modifier.spell_deactive != undefined){
							if(modifier.spell_deactive.cast_after_used){
								if(is_used) modifier.spell_deactive.id(source, Object.assign(modifier.spell_deactive.modifier, spell_modifier));
							}else{
								modifier.spell_deactive.id(source, Object.assign(modifier.spell_deactive.modifier, spell_modifier));
							}
						}
					}
				}else{
					if(is_holding && modifier.spell_deactive != undefined){
						if(modifier.spell_deactive.cast_after_used){
							if(is_used) modifier.spell_deactive.id(source, Object.assign(modifier.spell_deactive.modifier, spell_modifier));
						}else{
							modifier.spell_deactive.id(source, Object.assign(modifier.spell_deactive.modifier, spell_modifier));
						}
						is_holding = false;
					}
				}
			}catch(err){
				error_id = err;
				duration = 0;
			}
			if(error_id) throw error_id;
			if(modifier.ticking_duration) duration--;
		});

		if(modifier.action_type != "hold"){
			charged_id = callback_function.subscribe(s=>{
				if(id != s.source.id) return;
				if((type && !type.includes(s.itemStack.typeId)) || (!type && s.itemStack.typeId != modifier.item.typeId)) return;
				modifier.spell.id(source, Object.assign(modifier.spell.modifier, spell_modifier));
				if(!modifier.allow_cooldown) source.startItemCooldown(s.itemStack.getComponent("minecraft:cooldown").cooldownCategory, 0);
				if(!modifier.ticking_duration) duration--;
				if(!is_used) is_used = true;
				if(!is_holding) is_holding = true;
				
				s.source.playAnimation("animation.humanoid.magic.interact_spell", {
					blendOutTime: 0.1,
					stopExpression: "!query.is_using_item",
					controller: "casting" 
				});
			});
		}else{
			charged_id = world.afterEvents.itemStartUse.subscribe(s=>{
				if(id != s.source.id) return;
				if((type && !type.includes(s.itemStack.typeId)) || (!type && s.itemStack.typeId != modifier.item.typeId)) return;
				if(!modifier.allow_cooldown) source.startItemCooldown(s.itemStack.getComponent("minecraft:cooldown").cooldownCategory, 0);
				is_holding = true;
			});
			not_charged_id = world.afterEvents.itemReleaseUse.subscribe(s=>{
				if(id != s.source.id) return;
				is_holding = false;
			});
		}
	}else{
		let rotation_run;
		if(source.typeId == "amw:magic_cast_placeholder"){
			let intial_rotation = source.getRotation();
			let i = 0;
			rotation_run = system.runInterval(()=>{
				let added_rot = MagicPlaceholderPattern[(parseInt(i) % 20)];
				source.setRotation({
					x: intial_rotation.x + added_rot.x,
					y: intial_rotation.y + added_rot.y
				})
				i += 0.5;
			});

		}

		let delay = 40 + parseInt(Math.random() * 20);
		if(modifier.action_type == "hold") delay = 2;
		let cooldownId = system.runInterval(() =>{
			if(duration <= 0 || !source.isValid()){
				system.clearRun(cooldownId);
				if(rotation_run) system.clearRun(rotation_run);
				return;
			}
			// try{
				modifier.spell.id(source, Object.assign(modifier.spell.modifier, spell_modifier));
			// }catch(err){
			// 	duration = 0;
			// }
			duration--;
		}, delay);
	}
}

/*
{
	modifier: {
		iteration: INT
		delay: INT
		iteration_node: [
			{
				path: STRING > PATH > PATH
				node: {
					0: ANY,
					.
					.
					.
					2: ANY
				}
			}
		]
	}
}
*/

export function iterationCast(source, modifier){
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: modifier.source
	}
	let iteration = 1;
	if(modifier.iteration) iteration = modifier.iteration;
	let iteration_frame = [];
	if(modifier.iteration_node){
		for(let node of modifier.iteration_node){
			let type = 0;
			let data = {
				path: node.path,
				frame: []
			};
			let node_index = Object.keys(node.node);
			if(typeof node.node[node_index[0]] === "string"){
				type = 1;
			}else if(typeof node.node[node_index[0]] === "boolean"){
				type = 2;
			}else if(typeof node.node[node_index[0]] === "function"){
				type = 3;
			}else if(typeof node.node[node_index[0]] === "object"){
				type = 4;
			}
			if(!node.node[0]){
				node.node[0] = node.node[node_index[0]];
				node_index.unshift('0');
			}
			if(iteration > 1 && !node.node[iteration-1]){
				node.node[iteration-1] = node.node[node_index[node_index.length-1]];
				node_index.push((iteration-1).toString());
			}
			let index = 0;
			for(let frame = 0; frame < iteration; frame++){
				if(node.node[frame]){
					data.frame[frame] = node.node[frame];
					index++;
				}else{
					let mid = -(frame - node_index[index]) / (node_index[index] - node_index[index-1]);
					if(type == 0){
						data.frame[frame] = node.node[node_index[index]] * (1-mid) + node.node[node_index[index-1]] * mid;
					}else if(type > 0 && type < 4){
						data.frame[frame] = (mid > 0.5) ? node.node[node_index[index-1]] : node.node[node_index[index]];
					}else if(type == 4){
						data.frame[frame] = Vector.add(Vector.multiply(node.node[node_index[index]], (1-mid)), Vector.multiply(node.node[node_index[index-1]], mid))
					}
				}
			}
			iteration_frame.push(data);
		}
	}
	if(!modifier.delay){
		for(let frame = 0; frame < iteration; frame++){
			let data = modifier.spell;
			for(let frame_change of iteration_frame){
				data = findObjectKey(data, frame_change.path.split(">"), frame_change.frame[frame]);
			}
			data.id(source, Object.assign(data.modifier, spell_modifier));
		}
	}else{
		let frame = 0;
		let cooldownId = system.runInterval(() =>{
			if(frame >= iteration - 1){
				system.clearRun(cooldownId);
			}
			let data = modifier.spell;
			for(let frame_change of iteration_frame){
				data = findObjectKey(data, frame_change.path.split(">"), frame_change.frame[frame]);
			}
			try{
				data.id(source, Object.assign(data.modifier, spell_modifier));
			}catch(error){
				if(error != 31){
					system.clearRun(cooldownId);
				}
			}
			frame++;
		}, modifier.delay);
	}
}

export function changeNameTag(source, modifier){
	let name = modifier.name;

	let target = modifier.actor;

	if(modifier.target) target = modifier[modifier.target];

	if(target.typeId == "minecraft:player"){
		name = name.replace("{NAME}", target.name);
	}else{
		if(target.nameTag){
			name = name.replace("{NAME}", target.nameTag);
		}else{
			name = undefined;
		}
	}
	source.nameTag = name;
}


export function burstCast(source, modifier){
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: modifier.source
	}
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.source = modifier.source;
	if(modifier.stop_spell != undefined){
		modifier.stop_spell.modifier.item = modifier.item;
		modifier.stop_spell.modifier.actor = modifier.actor;
		modifier.stop_spell.modifier.source = modifier.source;
	}
	let select_inv = modifier.actor.selectedSlotIndex;
	let delay = (modifier.delay == undefined || modifier.delay == 0) ? 1 : modifier.delay;
	let use_animation = true;
	if(modifier.use_animation != undefined) use_animation = modifier.use_animation;
	
	if(modifier.enable_cooldown && modifier.actor.typeId == "minecraft:player" && (modifier.can_cancel == undefined || modifier.can_cancel == true)) modifier.actor.onScreenDisplay.setActionBar("Sneak to cancel spell");

	let cooldown = modifier.duration;
	let cooldownId;
	if(modifier.enable_cooldown){
		let target_duration = system.currentTick + cooldown;
		if((modifier.force_slot == undefined || modifier.force_slot == true) && use_animation){
			modifier.actor.playAnimation("animation.cast.holding_cast", {
				controller: "casting" 
			});
			modifier.actor.playAnimation("animation.item_hand.holding_cast", {
				controller: "casting_fpp" 
			});
		}
		cooldownId = system.runInterval(() =>{
			if((modifier.actor.isSneaking || cancel_spell.includes(modifier.actor.id)) && (modifier.can_cancel == undefined || modifier.can_cancel == true)){
				cooldown = 0;
				system.clearRun(cooldownId);
				setCooldown(modifier.actor.id, 0);
				
				if((modifier.force_slot == undefined || modifier.force_slot == true) && use_animation){
					modifier.actor.playAnimation("animation.humanoid.magic.casting_done", {
						blendOutTime: 0.1,
						controller: "casting" 
					});
					modifier.actor.playAnimation("animation.item_hand.casting_done", {
						blendOutTime: 0.1,
						controller: "casting_fpp" 
					});
				}
				return;
			}

			if(modifier.force_slot == undefined || modifier.force_slot == true) modifier.actor.selectedSlotIndex = select_inv;
			if(modifier.item != undefined) modifier.item.getComponent("minecraft:cooldown").startCooldown(modifier.actor);
			let cd = target_duration - system.currentTick;
			setCooldown(modifier.actor.id, parseInt(cd/modifier.duration*50));
		});
	}
	let cancel_reason;
	let runId = system.runInterval(() =>{
		if(cooldown < 0 || !source.isValid() || actor_dead.includes(modifier.actor.id)){
			if(modifier.stop_spell != undefined) modifier.stop_spell.id(source, Object.assign(modifier.stop_spell.modifier, spell_modifier));
			if(modifier.enable_cooldown){
				setCooldown(modifier.actor.id, 0);
				system.clearRun(cooldownId);
				
				if((modifier.force_slot == undefined || modifier.force_slot == true) && use_animation){
					modifier.actor.playAnimation("animation.humanoid.magic.casting_done", {
						blendOutTime: 0.1,
						controller: "casting" 
					});
					modifier.actor.playAnimation("animation.item_hand.casting_done", {
						blendOutTime: 0.1,
						controller: "casting_fpp" 
					});
				}
			}
			system.clearRun(runId);
			return;
		}

		try{
			modifier.spell.id(source, Object.assign(modifier.spell.modifier, spell_modifier));
		}catch(err){
			if(err == 31){
				cancel_reason = err;
				console.warn("skipped cast")
			}else if(err == 32){
				cancel_reason = err;
				cooldown = -1;
				console.warn("stopped cast")
			}else{
				cooldown = -1;
			}
		}
		cooldown -= delay;
	}, modifier.delay);
}

export function afterProjectileCast(source, modifier){
	let count = 8;
	let type_list = undefined;
	let target = source;

	if(modifier.count != undefined) count = modifier.count;
	if(modifier.type != undefined) type_list = modifier.type;
	if(modifier.target != undefined && modifier.target != "self") count = modifier[modifier.target];
	let max_count = count;

	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = modifier.passthru_source ? modifier.source : target;

	let cooldown_id;
	let summon_id;
	let cancel_id;

	cooldown_id = system.runInterval(()=>{
		if(!modifier.actor.isValid() || !target.isValid() || actor_dead.includes(target.id) || count <= 0 || (modifier.can_cancel && (modifier.actor.isSneaking || cancel_spell.includes(modifier.actor.id)))){
			system.clearRun(cooldown_id);
			world.afterEvents.entitySpawn.unsubscribe(summon_id);
			if(cancel_id != undefined) world.afterEvents.itemStartUse.unsubscribe(cancel_id);
			setCooldown(modifier.actor.id, 0);
			return;
		}
		if(modifier.enable_cooldown) setCooldown(modifier.actor.id, parseInt(count / max_count*50));
		if(modifier.ticking_duration) count--;
	});
		
	if(modifier.actor.typeId == "minecraft:player" && modifier.can_cancel){
		if(modifier.item != undefined){
			cancel_id = world.afterEvents.itemStartUse.subscribe( s => {
				if(ItemData.getCastWeapons()[s.itemStack.typeId] == undefined || modifier.actor.id != s.source.id) return;
				if(cooldown_id != undefined) system.clearRun(cooldown_id);
				world.afterEvents.entitySpawn.unsubscribe(summon_id);
				world.afterEvents.itemStartUse.unsubscribe(cancel_id);
				
				modifier.item.getComponent("minecraft:cooldown").startCooldown(modifier.actor);
				setCooldown(modifier.actor.id, 0);
			});
		}
		modifier.actor.onScreenDisplay.setActionBar("Use casting item to cancel spell");
	}

	summon_id = world.afterEvents.entitySpawn.subscribe(s=>{
		if((type_list != undefined && !type_list.includes(s.entity.typeId)) || !s.entity.hasComponent("minecraft:projectile")) return;
		let projectile = s.entity.getComponent("minecraft:projectile");
		if(projectile.owner == undefined || projectile.owner.id != target.id) return;

		modifier.spell.id(s.entity, modifier.spell.modifier);
		if(!modifier.ticking_duration) count--;
		if(count == 0){
			setCooldown(modifier.actor.id, 0);
			if(cooldown_id != undefined) system.clearRun(cooldown_id);
			world.afterEvents.entitySpawn.unsubscribe(summon_id);
			if(cancel_id != undefined) world.afterEvents.itemStartUse.unsubscribe(cancel_id);
		}
	});
}

export function changeProjectileComponents(source, modifier){
	if(!source.hasComponent("minecraft:projectile")) return;
	let projectile = source.getComponent("minecraft:projectile");

	if(modifier.air_inertia != undefined) projectile.airInertia = modifier.air_inertia;
	if(modifier.catch_fire_on_hurt != undefined) projectile.catchFireOnHurt = modifier.catch_fire_on_hurt;
	if(modifier.crit_particles_on_projectile_hurt != undefined) projectile.critParticlesOnProjectileHurt = modifier.crit_particles_on_projectile_hurt;
	if(modifier.destroy_on_projectile_hurt != undefined) projectile.destroyOnProjectileHurt = modifier.destroy_on_projectile_hurt;
	if(modifier.gravity != undefined) projectile.gravity = modifier.gravity;
	if(modifier.lightning_strike_on_hit != undefined) projectile.lightningStrikeOnHit = modifier.lightning_strike_on_hit;
	if(modifier.liquid_inertia != undefined) projectile.liquidInertia = modifier.liquid_inertia;
	if(modifier.on_fire_time != undefined) projectile.onFireTime = modifier.on_fire_time;
	if(modifier.should_bounce_on_hit != undefined) projectile.shouldBounceOnHit = modifier.should_bounce_on_hit;
	if(modifier.stop_on_hit != undefined) projectile.stopOnHit = modifier.stop_on_hit;
	if(modifier.speed != undefined) projectile.shoot(Vector.multiply(source.getVelocity(), modifier.speed));
}

export function projectileHitCast(source, modifier){
	if(!source.hasComponent("minecraft:projectile")) return;
	let id = source.id;
	let hit_block_id;
	let hit_entity_id;
	
	modifier.impact.modifier.actor = modifier.actor;
	modifier.impact.modifier.item = modifier.item;
	modifier.impact.modifier.source = source;

	let hit_type = "all";
	let count = 1;
	if(modifier.max_step) count = modifier.max_step;
	if(modifier.hit_type) hit_type = modifier.hit_type;

	let run_check_id = system.runInterval(()=>{
		if(!source.isValid()){
			if(hit_block_id != undefined) world.afterEvents.projectileHitBlock.unsubscribe(hit_block_id);
			if(hit_entity_id != undefined) world.afterEvents.projectileHitEntity.unsubscribe(hit_entity_id);
			system.clearRun(run_check_id);
		}
	})

	if(hit_type == "all" || hit_type == "block") hit_block_id = world.afterEvents.projectileHitBlock.subscribe(s=>{
		if(!source.isValid() || count <= 0){
			world.afterEvents.projectileHitBlock.unsubscribe(hit_block_id);
			if(hit_entity_id) world.afterEvents.projectileHitEntity.unsubscribe(hit_entity_id);
			system.clearRun(run_check_id);
		}
		if(s.projectile.id != id) return;
		let target = source;
		if(modifier.create_new_source || !target.isValid()) target = createDummySource(s.dimension, s.location, s.hitVector);
		modifier.impact.id(target, modifier.impact.modifier);
		count--;
	});
	if(hit_type == "all" || hit_type == "entity") hit_entity_id = world.afterEvents.projectileHitEntity.subscribe(s=>{
		if(!source.isValid() || count <= 0){
			if(hit_block_id) world.afterEvents.projectileHitBlock.unsubscribe(hit_block_id);
			world.afterEvents.projectileHitEntity.unsubscribe(hit_entity_id);
			system.clearRun(run_check_id);
		}
		if(s.projectile.id != id) return;
		let target;
		if(modifier.impact.return_self){
			target = source;
		}else{
			target = s.getEntityHit().entity
		}
		if(modifier.create_new_source || !target.isValid()) target = createDummySource(s.dimension, s.location, target.isValid() ? target.getViewDirection() : s.hitVector);
		modifier.impact.id(target, modifier.impact.modifier);
		count--;
	});
}

export function setBounceProjectile(source, modifier){
	let count = 8;
	let bounce_strength = 0.9;
	if(modifier.max_step) count = modifier.max_step;
	if(modifier.bounce_strength) bounce_strength = modifier.bounce_strength;
	let strength = bounce_strength;

	let run_check_id = system.runInterval(()=>{
		if(!source.isValid()){
			if(hit_id != undefined) world.afterEvents.projectileHitBlock.unsubscribe(hit_id);
			system.clearRun(run_check_id);
		}
	})
	let initial_velocity = source.getVelocity();
	let initial_speed = Vector.getLength(initial_velocity);

	let hit_id = world.afterEvents.projectileHitBlock.subscribe(s=>{
		if(!source.isValid() || count <= 0){
			world.afterEvents.projectileHitBlock.unsubscribe(hit_id);
			system.clearRun(run_check_id);
			return;
		}
		if(s.projectile.id != source.id) return;

		let block_hit = s.getBlockHit();
		let projectile = s.projectile.getComponent("minecraft:projectile");
		let multiply = { x: 1, y: -1, z: 1 };

		switch(block_hit.face) {
			case "Down":
			case "Up":
				multiply.y = -strength;
				break;
			case "North":
			case "South":
				multiply.z = -strength;
				break;
			case "West":
			case "East":
				multiply.x = -strength;
				break;
		}
		
		let velocity = Vector.multiply(s.hitVector, multiply).multiply(initial_speed);
		let location = Vector.add(s.location, Vector.multiply(s.hitVector, -0.5));
		s.projectile.teleport(location)
		projectile.shoot(velocity)
		strength = strength * bounce_strength;
		count--;
	})
}

export function sequenceCast(source, modifier){
	let select_inv = modifier.actor.selectedSlotIndex;
	let delay = Math.max(modifier.delay, 1);
	
	if(modifier.enable_cooldown && modifier.actor.typeId == "minecraft:player") modifier.actor.onScreenDisplay.setActionBar("Sneak to cancel spell");

	let spell_sequence = 0;
	let spell_length = modifier.spell.length;
	if(modifier.start_delay == false || modifier.start_delay == undefined){
		try{
			let spell = modifier.spell[spell_sequence];
			spell.modifier.actor = modifier.actor;
			spell.modifier.item = modifier.item;
			spell.modifier.source = modifier.source;
			spell.id(source, spell.modifier);
			
			if(modifier.enable_cooldown){
				modifier.actor.selectedSlotIndex = select_inv;
				if(modifier.item != undefined) modifier.item.getComponent("minecraft:cooldown").startCooldown(modifier.actor);
			}
			spell_sequence++;
		}catch(err){
			return;
		}
	}
	
	if(spell_length == spell_sequence) return;

	let runId = system.runInterval(() =>{
		if(spell_sequence == -1  || spell_sequence > spell_length  || source == undefined || (modifier.enable_cooldown && (modifier.actor.isSneaking || cancel_spell.includes(modifier.actor.id)))){
			delete sequence_cast_id[modifier.actor.id]
			system.clearRun(runId);
			return;
		}

		try{
			let spell = modifier.spell[spell_sequence];
			spell.modifier.actor = modifier.actor;
			spell.modifier.item = modifier.item;
			spell.modifier.source = modifier.source;
			spell.id(source, spell.modifier);
			
			if(modifier.enable_cooldown){
				modifier.actor.selectedSlotIndex = select_inv;
				if(modifier.item != undefined) modifier.item.getComponent("minecraft:cooldown").startCooldown(modifier.actor);
			}
			spell_sequence++;
		}catch(err){
			spell_sequence = -1;
		}

	}, modifier.delay);

	sequence_cast_id[modifier.actor.id] = runId;
}

export function ramdomChanceSpell(source, modifier){
	if(modifier.chance < Math.random()) return;

	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = modifier.source;
	modifier.spell.id(source, modifier.spell.modifier);
}

export function castMultipleSpell(source, modifier){
	let cancel_reason;
	for(let spell of modifier.spell){
		spell.modifier.actor = modifier.actor;
		spell.modifier.item = modifier.item;
		spell.modifier.source = modifier.source;
		try{
			spell.id(source, spell.modifier);
		}catch(err){
			cancel_reason = err;
			break;
		}
	}
	if(cancel_reason > 30){
		throw cancel_reason;
	}
}

export function damageToSource(source, modifier){
	if(source.id == -1) return;
	let data = {
		cause: "magic"
	};
	if(modifier.from != undefined) data.damagingEntity = modifier[modifier.from];
	if(modifier.cause != undefined) data.cause = modifier.cause;
	source.applyDamage(modifier.strength, data);
}

export function castSpellInlineView(source, modifier){
	let view = source.getViewDirection();
	let gap = (modifier.gap == undefined) ? 1 : modifier.gap;
	let deadzone = (modifier.deadzone == undefined) ? 1 : modifier.deadzone;

	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: source
	}

	let dimension = source.dimension;
	let location = Vector.add(source.getHeadLocation(), Vector.multiply(view, deadzone + 0.01));

	for(let i = deadzone; i < modifier.distance; i += gap){
		modifier.spell.id(createDummySource(dimension, location.clone(), view), Object.assign(modifier.spell.modifier, spell_modifier));
		location = Vector.add(location, Vector.multiply(view, gap));
	}
}

export function castSpellInlineDistance(source, modifier){
	let gap = (modifier.gap == undefined) ? 1 : modifier.gap;
	let range = (modifier.range == undefined) ? 8 : modifier.range;
	let max_length = (modifier.length == undefined) ? range : modifier.length;

	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: source
	}

	let total_range = Math.sqrt((range ** 2) * 2);

	let dist = {
		maxDistance: total_range
	}

	let dimension = source.dimension;
	let from_location;
	let estimated_dist;
	let estimated_direction;

	if(source.typeId == "minecraft:player") source.onScreenDisplay.setActionBar("Interact with item to cast spell");
	setCooldown(modifier.actor.id, 50);
	let is_holding = false;
	let item;

	source.runCommand("scriptevent amw:spell active");
	if(source.typeId == "minecraft:player") source.startItemCooldown(modifier.item.getComponent("minecraft:cooldown").cooldownCategory, 0);
	
	if(source.typeId == "minecraft:player"){
		let run_id = system.runInterval(()=>{
			if(!source.isValid() || actor_dead.includes(source.id)){
				world.afterEvents.itemStopUse.unsubscribe(stop_id);
				world.afterEvents.itemStartUse.unsubscribe(start_id);
				system.clearRun(run_id);
				setCooldown(modifier.actor.id, 0);
			}
			if(from_location == undefined) return;
			if(is_holding){
				
				let estimated_location = source.getEntitiesFromViewDirection(dist);
				if(estimated_location.length > 0){
					estimated_location = Vector.add(source.location, Vector.multiply(source.getViewDirection(), estimated_location[0].distance));
				}else{
					estimated_location = source.getBlockFromViewDirection(dist);
					if(estimated_location != undefined){
						estimated_location = Vector.add(estimated_location.block.location, estimated_location.faceLocation);
					}else{
						estimated_location = Vector.add(source.getHeadLocation(), Vector.multiply(source.getViewDirection(), range));
					}
				}
				
				let line_map = new MolangVariableMap();
	
				let distance = Vector.distance(from_location, estimated_location) + 0.01;
				let direction = Vector.subtract(estimated_location, from_location).divide(distance);
				distance = Math.min(distance, max_length);
	
				let norm_dist = distance / max_length;
				
				line_map.setVector3("variable.direction", direction);
				line_map.setFloat("variable.length", distance);
				if(modifier.length == undefined){
					line_map.setColorRGBA("variable.color", { red: 0.05, green: 0.51, blue: 1, alpha: 1.0});
				}else{
					let color = Vector.mix({
						x: 255,
						y: 255,
						z: 255
					},{
						x: 13,
						y: 131,
						z: 255
					}, Math.min(norm_dist * 2, 1.0));
	
					color = Vector.mix(color,{
						x: 137,
						y: 11,
						z: 11
					}, Math.max((norm_dist - 0.5) * 2, 0.0));
		
					color.divide(255);
					
					line_map.setColorRGBA("variable.color", { red: color.x, green: color.y, blue: color.z, alpha: 1.0});
				}
				line_map.setVector3("variable.location", Vector.subtract(from_location, source.location));
				dimension.spawnParticle("magic:cast_inline_guide", source.location, line_map);
	
				estimated_dist = distance;
				estimated_direction = direction;
			}else{
				system.clearRun(run_id);
			}
		})
	
		let start_id = world.afterEvents.itemStartUse.subscribe( s => {
			if(s.itemStack.typeId != modifier.item.typeId || s.source.id != source.id) return;
			source.startItemCooldown(s.itemStack.getComponent("minecraft:cooldown").cooldownCategory, 0);
			from_location = source.getEntitiesFromViewDirection(dist);
			if(from_location.length > 0){
				from_location = Vector.add(source.location, Vector.multiply(source.getViewDirection(), from_location[0].distance));
			}else{
				from_location = source.getBlockFromViewDirection(dist);
				if(from_location != undefined){
					from_location = Vector.add(from_location.block.location, from_location.faceLocation);
				}else{
					from_location = Vector.add(source.getHeadLocation(), Vector.multiply(source.getViewDirection(), range));
				}
			}
	
			is_holding = true;
			item = s.itemStack;
			world.afterEvents.itemStartUse.unsubscribe(start_id);
		});
	
		let stop_id = world.afterEvents.itemStopUse.subscribe( s => {
			if(s.itemStack.typeId != modifier.item.typeId || s.source.id != source.id) return;
			source.runCommand("scriptevent amw:spell deactive");
			is_holding = false;
			setCooldown(modifier.actor.id, 0);
	
			let to_location = Vector.add(from_location, Vector.multiply(estimated_direction, estimated_dist));
	
			let distance = estimated_dist + 0.01;
			let view_spell = estimated_direction;
			distance = Math.floor(Math.min(distance, max_length) / gap);
	
			let location = from_location.clone();
	
			let location_gap = Vector.multiply(view_spell, gap);
	
			if(modifier.spell != undefined) for(let i = 0; i < distance; i++){
				modifier.spell.id(createDummySource(dimension, location.clone(), view_spell), Object.assign(modifier.spell.modifier, spell_modifier));
				location = Vector.add(location, location_gap);
			}
	
			if(modifier.spell_from != undefined){
				if(typeof modifier.spell_from !== String){
					modifier.spell_from.id(createDummySource(dimension, from_location, view_spell), Object.assign(modifier.spell_from.modifier, spell_modifier));
				}else{
					modifier[modifier.spell_from].id(createDummySource(dimension, from_location, view_spell), Object.assign(modifier[modifier.spell_from].modifier, spell_modifier));
				}
			}
	
			if(modifier.spell_to != undefined){
				if(typeof modifier.spell_to !== String){
					modifier.spell_to.id(createDummySource(dimension, to_location, view_spell), Object.assign(modifier.spell_to.modifier, spell_modifier));
				}else{
					modifier[modifier.spell_to].id(createDummySource(dimension, to_location, view_spell), Object.assign(modifier[modifier.spell_to].modifier, spell_modifier));
				}
			}
	
	
			world.afterEvents.itemStopUse.unsubscribe(stop_id);
			world.afterEvents.itemStartUse.unsubscribe(start_id);
		});
	}else{
		let intial_rotation;
		if(source.typeId == "amw:magic_cast_placeholder"){
			intial_rotation = source.getRotation();
			source.setRotation({
				x: intial_rotation.x + (Math.random()* 2 - 1) * 45,
				y: intial_rotation.y + (Math.random()* 2 - 1) * 45
			})
		}
		from_location = source.getEntitiesFromViewDirection(dist);
		if(from_location.length > 0){
			from_location = Vector.add(source.location, Vector.multiply(source.getViewDirection(), from_location[0].distance));
		}else{
			from_location = source.getBlockFromViewDirection(dist);
			if(from_location != undefined){
				from_location = Vector.add(from_location.block.location, from_location.faceLocation);
			}else{
				from_location = Vector.add(source.getHeadLocation(), Vector.multiply(source.getViewDirection(), range));
			}
		}

		system.runTimeout(()=>{
			if(source.typeId == "amw:magic_cast_placeholder"){
				source.setRotation({
					x: intial_rotation.x + (Math.random()* 2 - 1) * 45,
					y: intial_rotation.y + (Math.random()* 2 - 1) * 45
				})
			}
			
			let to_location = source.getEntitiesFromViewDirection(dist);
			if(to_location.length > 0){
				to_location = Vector.add(source.location, Vector.multiply(source.getViewDirection(), to_location[0].distance));
			}else{
				to_location = source.getBlockFromViewDirection(dist);
				if(to_location != undefined){
					to_location = Vector.add(to_location.block.location, to_location.faceLocation);
				}else{
					to_location = Vector.add(source.getHeadLocation(), Vector.multiply(source.getViewDirection(), range));
				}
			};
			
			let distance = Vector.distance(from_location, to_location) + 0.01;
			let view_spell = Vector.subtract(to_location, from_location).divide(distance);
			distance = Math.min(distance, max_length) + 0.01;
			
			distance = Math.floor(Math.min(distance, max_length) / gap);
	
			let location = from_location.clone();
	
			let location_gap = Vector.multiply(view_spell, gap);
	
			if(modifier.spell != undefined) for(let i = 0; i < distance; i++){
				modifier.spell.id(createDummySource(dimension, location.clone(), view_spell), Object.assign(modifier.spell.modifier, spell_modifier));
				location = Vector.add(location, location_gap);
			}
	
			if(modifier.spell_from != undefined){
				if(typeof modifier.spell_from !== String){
					modifier.spell_from.id(createDummySource(dimension, from_location, view_spell), Object.assign(modifier.spell_from.modifier, spell_modifier));
				}else{
					modifier[modifier.spell_from].id(createDummySource(dimension, from_location, view_spell), Object.assign(modifier[modifier.spell_from].modifier, spell_modifier));
				}
			}
	
			if(modifier.spell_to != undefined){
				if(typeof modifier.spell_to !== String){
					modifier.spell_to.id(createDummySource(dimension, to_location, view_spell), Object.assign(modifier.spell_to.modifier, spell_modifier));
				}else{
					modifier[modifier.spell_to].id(createDummySource(dimension, to_location, view_spell), Object.assign(modifier[modifier.spell_to].modifier, spell_modifier));
				}
			}

			if(source.typeId == "amw:magic_cast_placeholder") source.remove();
		}, 20);
	}
}

export function castSpellAtHit(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = modifier.source;
	let max_duration = (modifier.duration == undefined ? 200 : modifier.duration);
	let duration = max_duration;
	
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: source
	}

	let enable_cooldown = (modifier.enable_cooldown == undefined ? true : modifier.enable_cooldown);
	let can_cancel = (modifier.can_cancel == undefined ? true : modifier.can_cancel);

	if(modifier.actor.typeId == "minecraft:player" && can_cancel) modifier.actor.onScreenDisplay.setActionBar("Sneak to cancel spell");

	let hitId = world.afterEvents.entityHitEntity.subscribe( s=>{
		if(modifier.set_damage_path == undefined){
			modifier.spell.id(s.hitEntity, Object.assign(modifier.spell.modifier, spell_modifier));
			if(!modifier.ticking_duration) duration--;
		}else{
			let percent = (modifier.damage_percentage == undefined ? 1: modifier.damage_percentage);
			system.runTimeout(()=>{
				let data = modifier.spell;
				data = findObjectKey(data, modifier.set_damage_path.split(">"), entity_damage[s.hitEntity.id] * percent);
				
				modifier.spell.id(s.hitEntity, Object.assign(data.modifier, spell_modifier));
				if(!modifier.ticking_duration) duration--;
			})
		}
	}, { entities: [ source ]});

	let run_id = system.runInterval(()=>{
		if(!source.isValid() || !modifier.actor.isValid() || actor_dead.includes(source.id) || duration <= 0 || (can_cancel && modifier.actor.isSneaking)){
			world.afterEvents.entityHitEntity.unsubscribe(hitId);
			system.clearRun(run_id);
			if(source.typeId == "minecraft:player" && enable_cooldown) setCooldown(source.id, 0);
			if(modifier.stop_spell != undefined) modifier.stop_spell.id(source, Object.assign(modifier.stop_spell.modifier, spell_modifier));
		}
		if(source.typeId == "minecraft:player" && enable_cooldown) setCooldown(source.id, parseInt(duration/max_duration*50));
		if(modifier.ticking_duration) duration--;
	});
}

export function cloneTarget(source, modifier){
	let target = source;
	if(modifier.target != undefined && modifier.target != "self") target = modifier[modifier.target];

	if(target.typeId == "minecraft:player") return;

	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: target
	}

	let rotation = source.getRotation();
	let velocity = source.getVelocity();
	let location = source.getHeadLocation();

	if(modifier.clone != undefined){
		if(modifier.clone.rotation == "none"){
			rotation = { x: 0, y: 0 };
		}else if(modifier.clone.rotation != "self"){
			rotation = modifier[modifier.clone.rotation].getRotation();
		}

		if(modifier.clone.velocity == "none"){
			velocity = { x: 0, y: 0, z: 0 };
		}else if(modifier.clone.velocity != "self"){
			velocity = modifier[modifier.clone.velocity].getVelocity();
		}

		if(modifier.clone.location != undefined && modifier.clone.location != "self"){
			location = modifier[modifier.clone.location].getHeadLocation();
		}
	}

	let entity = source.dimension.spawnEntity(target.typeId, location);
	entity.setRotation(rotation);
	entity.applyImpulse(velocity);

	if(modifier.spell != undefined){
		modifier.spell.id(entity, Object.assign(modifier.spell.modifier, spell_modifier));
	}
}

export function castRotatedSpell(source, modifier){
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: ((modifier.passthru_source) ? modifier.source : source)
	}

	let rot = source.getRotation();
	if(modifier.reset_axis != undefined){
		rot[modifier.reset_axis] = 0;
	}
	let dimension = source.dimension;
	let angle;
	let count = (modifier.count != undefined) ? modifier.count : 1;
	let distance = (modifier.distance != undefined) ? modifier.distance : 0;

	let max = rot[modifier.axis] + 360;
	let loc = source.getHeadLocation();
	
	if( modifier.offset != undefined){
		loc = Vector.add(loc, modifier.offset);
	}

	if(modifier.count != undefined && count > 1){
		angle = modifier.degree / (count - 1);
		rot[modifier.axis] -= modifier.degree / 2.0;

		for(let off = 0; off < count; off++){
			if(rot[modifier.axis] > max) break;
			let rotated = anglesToVector(rot);
			let pos = Vector.add(loc, Vector.multiply(rotated, distance));
			modifier.spell.id(createDummySource(dimension, pos, rotated), Object.assign(modifier.spell.modifier, spell_modifier));
			rot[modifier.axis] += angle;
		}
	}else{
		rot[modifier.reset_axis] = modifier.degree;
		let rotated = anglesToVector(rot);
		let pos = Vector.add(loc, Vector.multiply(rotated, distance));
		modifier.spell.id(createDummySource(dimension, pos, rotated), Object.assign(modifier.spell.modifier, spell_modifier));
	}
}

export function castRandomLocationSpell(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = source;

	let dimension = source.dimension;
	let location = source.location;

	if(modifier.head_location) location = source.getHeadLocation();
	let strength = (modifier.strength == undefined) ? 0.1 : modifier.strength;
	
	let random_location = {
		x: Math.random() * 2 - 1,
		y: Math.random() * 2 - 1,
		z: Math.random() * 2 - 1
	}
	
	if(modifier.size){
		random_location = {
			x: random_location.x * modifier.size.x,
			y: random_location.y * modifier.size.y,
			z: random_location.z * modifier.size.z
		}
	}
	
	location = Vector.add(location, Vector.multiply(random_location, strength));

	if(modifier.offset) location = Vector.add(location, modifier.offset);

	let view = source.getViewDirection();
	if(modifier.focus != undefined && modifier[modifier.focus] != undefined){
		let distance = Vector.distance(modifier[modifier.focus].location, location);
		view = Vector.subtract(modifier[modifier.focus].location, location).divide(distance);
	}
	if(modifier.focus == "source"){
		let distance = Vector.distance(source.location, location);
		view = Vector.subtract(source.location, location).divide(distance);
	}
	if(modifier.focus == "view"){
		view = source.getViewDirection();
	}

	modifier.spell.id(createDummySource(dimension, location, view), modifier.spell.modifier);
}

export function castRandomRotatedSpell(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = source;

	let dimension = source.dimension;
	let location = source.location;
	if(modifier.head_location) location = source.getHeadLocation();
	let strength = (modifier.strength == undefined) ? 0.1 : modifier.strength;
	let rotation = (modifier.use_velocity) ? source.getVelocity() : source.getViewDirection();
	let random_rotation = {
		x: Math.random() * 2 - 1,
		y: Math.random() * 2 - 1,
		z: Math.random() * 2 - 1
	}
	let rotated = Vector.add(Vector.multiply(rotation, 1 - strength), Vector.multiply(random_rotation, strength));

	modifier.spell.id(createDummySource(dimension, location, rotated), modifier.spell.modifier);
}

export function castRandomSpell(source, modifier){
	let spell_length = modifier.spell.length;
	let random_select = Math.floor(Math.random() * spell_length);
	if(modifier.select != undefined) random_select = modifier.select % spell_length;

	let spell = modifier.spell[random_select];

	spell.modifier.actor = modifier.actor;
	spell.modifier.item = modifier.item;
	spell.modifier.source = modifier.source;
	spell.id(source, spell.modifier);
}

export function castRepeatSpell(source, modifier){
	modifier.spell.modifier.actor = modifier.actor;
	modifier.spell.modifier.item = modifier.item;
	modifier.spell.modifier.source = modifier.source;
	
	for(let i = 0; i < modifier.count; i++){
		modifier.spell.id(source, modifier.spell.modifier);
	}
}

export function castMultipleLocation(source, modifier){
	if(modifier.impact){
		modifier.impact.modifier.actor = modifier.actor;
		modifier.impact.modifier.item = modifier.item;
		modifier.impact.modifier.source = source;
	}
	let length = modifier.formation[0].length;
	let width = modifier.formation.length;
	let dimension = source.dimension;
	
	let view = source.getRotation();
	let location = source.location;
	let rot = (view.y - 180) * Math.PI / 180;

	let focus;
	if(modifier.focus == "view"){
		focus = source.getEntitiesFromViewDirection()[0];
		if(focus != undefined) focus = focus.entity;
		if(focus == undefined){
			focus = source.getBlockFromViewDirection();
			if(focus != undefined) focus = focus.block;
		}
		if(focus == undefined){
			let temp_view = source.getViewDirection();
			focus = {
				x: temp_view.x * 32 + location.x,
				y: temp_view.y * 32 + location.y,
				z: temp_view.z * 32 + location.z
			}
		}else{
			focus = focus.location;
		}
	}else if(modifier.focus == "self"){
		focus = source.location;
	}else{
		let temp_focus = {
			x: modifier.focus.x + modifier.offset.x,
			y: modifier.focus.y + modifier.offset.y,
			z: -(modifier.focus.z + modifier.offset.z)
		}
		focus = {
			x: temp_focus.x*Math.cos(rot) - temp_focus.z*Math.sin(rot) + location.x,
			y: temp_focus.y + location.y,
			z: temp_focus.x*Math.sin(rot) + temp_focus.z*Math.cos(rot) + location.z
		}
	}
	

	for(let i = 0; i < length; i++){
		for(let j = 0; j < width; j++){
			let pos = modifier.formation[j][i];
			if(pos == "O") continue;
			let x_dist = i - modifier.ancor[0] + 1; 
			let z_dist = j - modifier.ancor[1] + 1; 

			let temp_loc = {
				x: x_dist * modifier.gap + modifier.offset.x,
				y: modifier.offset.y,
				z: z_dist * modifier.gap + modifier.offset.z
			}
			let target_loc = {
				x: temp_loc.x*Math.cos(rot) - temp_loc.z*Math.sin(rot) + location.x,
				y: temp_loc.y + location.y,
				z: temp_loc.x*Math.sin(rot) + temp_loc.z*Math.cos(rot) + location.z
			}
			let view_pos = {
				x: focus.x - target_loc.x,
				y: focus.y - target_loc.y,
				z: focus.z - target_loc.z
			}
			let dist = Math.sqrt(Math.pow(view_pos.x, 2) + Math.pow(view_pos.y, 2) + Math.pow(view_pos.z, 2)) + 0.01;
			view_pos.x /= dist;
			view_pos.y /= dist;
			view_pos.z /= dist;
			
			let dummy = createDummySource(dimension, target_loc, view_pos);
			// modifier.impact.modifier.source = dummy;

			modifier.impact.id(dummy, modifier.impact.modifier);
		}
	}
}

export function fireBreath(source, modifier){
	let player_view = source.getViewDirection();
	let cast_loc = source.location;
	let breath_map = new MolangVariableMap();
	breath_map.setSpeedAndDirection("variable.direction_script", 2, new Vector(player_view.x, player_view.y, player_view.z));
	let power = 4;
	player_view.x *= power;
	player_view.y *= power;
	player_view.z *= power;
	cast_loc.x += player_view.x;
	cast_loc.y += player_view.y;
	cast_loc.z += player_view.z;
	for(let entity of source.dimension.getEntities({location: cast_loc, maxDistance: 4, excludeFamilies: [ "magic" ]})){
		if(entity.id == source.id) continue;
		entity.setOnFire(modifier.strength, true);
		entity.applyDamage(modifier.strength / 3, { cause: "magic", damagingEntity: source });
	}
	
	source.dimension.spawnParticle("magic:fire_breath_effect", source.getHeadLocation(), breath_map);
}

export function addVolume(source, modifier){
	let id = volume_effect_id[modifier.type];
	if(id == undefined){
		volume_effect_id[modifier.type] = volume_id;
		id = volume_id;
		volume_id += 1;
	}
	console.warn("volume_id: " + id)

	let dimension = source.dimension;
	let scan = {
		location: source.location
	}
	if(modifier.offset){
		scan = {
			location: Vector.add(source.location, modifier.offset)
		}
	}
	if(isNaN(modifier.size)){
		scan.volume = modifier.size;
	}else{
		scan.maxDistance = modifier.size
	}
	let duration = (modifier.duration == undefined) ? 200 : modifier.duration;
	scan.type = "minecraft:player";

	let entity_temp = {};
	let runId = system.runInterval(()=>{
		if(duration <= 0){
			for(let entity_id of Object.keys(entity_temp)){
				entity_temp[entity_id].runCommandAsync("fog @s remove amw:volume_" + id);
			}
			system.clearRun(runId);
			return;
		}
		let keys = Object.keys(entity_temp);
		for(let entity of dimension.getEntities(scan)){
			if(!entity_temp[entity.id]) entity_temp[entity.id] = entity;
			entity.runCommandAsync("fog @s push " + modifier.type + " amw:volume_" + id);
			keys.pop(entity.id);
		}
		if(keys.length > 0) for(let entity_id of keys){
			entity_temp[entity_id].runCommandAsync("fog @s remove amw:volume_" + id);
		}
		duration--;
	})
}

export function changeModifier(source, modifier){
	let keys = Object.keys(modifier.change);
	for(let id of keys){
		let to = undefined;
		if(modifier.change[id] == "self"){
			to = source;
		}else{
			to = modifier[modifier.change[id]];
		}
		modifier[id] = to;
	}
}

export function rotateProjectileToTarget(source, modifier){
	if(source.hasComponent("minecraft:projectile")){
		let target = modifier.source;
		if(modifier.target != undefined) target = modifier[modifier.target];

		let projectile = source.getComponent("minecraft:projectile");
		
		let velocity = source.getVelocity();
		let velocity_speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);

		let strength = 1;
		if(modifier.strength != undefined) strength = modifier.strength;

		let direction = Vector.subtract(target.getHeadLocation(), source.location);
		let direction_distance = Vector.getLength(direction);
		direction = Vector.divide(direction, direction_distance);
		direction = Vector.multiply(direction, velocity_speed);

		let impulse = Vector.add(Vector.multiply(direction, strength), Vector.multiply(velocity, 1 - strength));
		if(modifier.multiplier) impulse = Vector.multiply(impulse, modifier.multiplier);
		if(modifier.add) impulse = Vector.add(impulse, modifier.add);
		projectile.shoot(impulse);
	}
}

export function castProjectile(source, modifier){
	const spell_modifier = {
		item: modifier.item,
		actor: modifier.actor,
		source: modifier.source
	}
	let location = source.getHeadLocation();
	let vel = source.getViewDirection();
	location.x += vel.x;
	location.y += vel.y;
	location.z += vel.z;
	let dimension = source.dimension;
	let cast = dimension.spawnEntity(modifier.type, location);
	let projectile = undefined;
	if(cast.hasComponent("minecraft:projectile")){
		projectile = cast.getComponent("minecraft:projectile");
		if(modifier.owner != undefined){
			if(modifier.owner == "self"){
				projectile.owner = source;
			}else{
				projectile.owner = modifier[modifier.owner];
			}
		}else{
			projectile.owner = (source.id != -1 ) ?  source : modifier.actor;
		}

		// let entity_name = "summoned_magic" + cast.id;
		// cast.nameTag = entity_name;
		// let run_count = 2;
		// let run_check_target_id = system.runInterval(()=>{
		// 	if(!cast.isValid()){
		// 		// console.warn("entity not found, cheking new one!");
		// 		let entity_temp = dimension.getEntities({name: entity_name});
		// 		// console.warn("entity with similar is : " + entity_temp.length)

		// 		if(entity_temp.length > 0){
		// 			cast = entity_temp[0];
		// 			// console.warn("entity found, replacing to new entity!");
		// 			cast.nameTag = "";
		// 			system.clearRun(run_check_target_id);
		// 		}
		// 	}
		// 	if(run_count <= 0){
		// 		if(cast.isValid()) cast.nameTag = "";
		// 		system.clearRun(run_check_target_id);
		// 	}
		// 	run_count--;
		// });
	}
	
	let rot  = source.getRotation();
//	cast.teleport(source.location, source.dimension, rot.x, rot.y);

	vel.x *= modifier.power;
	vel.y *= modifier.power;
	vel.z *= modifier.power;
	if(projectile != undefined){
		projectile.shoot(vel);
	}else{
		cast.setRotation(rot);	
		cast.applyImpulse(vel);
	}
	
	if(modifier.spell != undefined){
		modifier.spell.id(cast, Object.assign(modifier.spell.modifier, spell_modifier));
	}
	
	if(modifier.despawn != undefined){
		system.runTimeout( () => {
			try{
				cast.remove();
			}catch(err){}
		}, modifier.despawn);
	}
};

export function castSpellOrb(source, modifier){
	if(modifier.impact){
		modifier.impact.modifier.actor = modifier.actor;
		modifier.impact.modifier.item = modifier.item;
		modifier.impact.modifier.source = source;
	}
	if(modifier.ongoing){
		modifier.ongoing.modifier.actor = modifier.actor;
		modifier.ongoing.modifier.item = modifier.item;
		modifier.ongoing.modifier.source = source;
	}
	let countdown = modifier.duration;
	let player_view = source.getViewDirection();
	let cast_loc = source.getHeadLocation();
	cast_loc.y -= Math.max(source.getRotation().x/90, 0);
	let deadzone = (modifier.deadzone == undefined) ? 2 : modifier.deadzone;
	if(deadzone > 0){
		cast_loc.x += player_view.x * deadzone;
		cast_loc.y += player_view.y * deadzone;
		cast_loc.z += player_view.z * deadzone;
	}
	
	let cast = source.dimension.spawnEntity(modifier.type, cast_loc);
	let projectile;
	if(cast.hasComponent("minecraft:projectile")){
		projectile = cast.getComponent("minecraft:projectile");
		if(modifier.owner == "self") projectile.owner = source;
		if(modifier.owner != undefined){
			projectile.owner = modifier[modifier.owner];
		}else{
			projectile.owner = (source.id != -1 ) ?  source : modifier.actor;
		}
	}

	if(projectile != undefined){
		projectile.shoot(player_view);
		projectile.gravity = 0;
	}else{
		cast.applyImpulse(Vector.multiply(player_view, 0.1));
		cast.setRotation(source.getRotation());
	}
	let dim = cast.dimension;
	let loc = cast.location;
	let power = modifier.power;
	player_view.x *= power;
	player_view.y *= power;
	player_view.z *= power;
	let delay = countdown;
	if(modifier.delay) countdown += modifier.delay;
	let cast_loc_vel = cast.location;


	let run_id = system.runInterval(() => {
		if(countdown == 0){
			system.clearRun(run_id);
			if(modifier.impact) {
				modifier.impact.id(createDummySource(source.dimension, loc, player_view), modifier.impact.modifier);
				if(modifier.impact.particles != undefined) dim.spawnParticle(modifier.impact.particles, loc, particleMap);
			}
			try{
				cast.remove();
			}catch(err){}
			return;
		}
		try{
			cast.setRotation(cast.getRotation());
			if(modifier.particles != undefined) dim.spawnParticle(modifier.particles, loc, particleMap);
			/*if(modifier.stop_on_stick == undefined || modifier.stop_on_stick == true){
			let vel = cast.getVelocity();
			if((vel.x == 0 || vel.z == 0) && vel.y != 0){
				if(Vector.distance(cast_loc_vel, cast.location) < 0.01){
					countdown = 0;
					return;
				}else{
					cast_loc_vel = cast.location;
				}
			}*/
			if(projectile != undefined){
				projectile.shoot(player_view);
			}else{
				cast.clearVelocity();
				cast.applyImpulse(player_view);
			}
			
			loc = cast.location;
			dim = cast.dimension;
			if(modifier.ongoing && (system.currentTick % modifier.ongoing.delay == 0 || modifier.ongoing.delay == 0 || modifier.ongoing.delay == undefined)) modifier.ongoing.id(cast, modifier.ongoing.modifier);
		}catch(err){
			countdown = 0;
			return;
		}
		countdown--;
	});
	return cast;
};

export function castSpellLinear(source, modifier){
	if(modifier.impact){
		modifier.impact.modifier.actor = modifier.actor;
		modifier.impact.modifier.item = modifier.item;
		modifier.impact.modifier.source = source;
	}
	if(modifier.ongoing){
		modifier.ongoing.modifier.actor = modifier.actor;
		modifier.ongoing.modifier.item = modifier.item;
		modifier.ongoing.modifier.source = source;
	}
	let countdown = modifier.duration;
	let player_view = source.getViewDirection();
	let cast_loc = source.location;
	cast_loc.x += player_view.x;
	cast_loc.z += player_view.z;
	let cast = source.dimension.spawnEntity(modifier.type, cast_loc);
	let rot  = source.getRotation();
	cast.teleport(cast_loc, {rotation: rot});
	let dim = cast.dimension;
	let loc = cast.location;
	let power = modifier.power;
	player_view.x *= power;
	player_view.y = 0;
	player_view.z *= power;
	let run_id = system.runInterval(() => {
		if(countdown == 0){
			system.clearRun(run_id);
			if(modifier.impact) {
				modifier.impact.id(createDummySource(source.dimension, loc), modifier.impact.modifier);
				if(modifier.impact.particles != undefined) dim.spawnParticle(modifier.impact.particles, loc, particleMap);
			}
			cast.remove();
			return;
		}
		try{
			if(modifier.particles != undefined) dim.spawnParticle(modifier.particles, loc, particleMap);
			let vel = cast.getVelocity();
			if((vel.x == 0 || vel.z == 0) && vel.y != 0){
				cast.remove();
				return;
			}

			cast.clearVelocity();
			cast.applyImpulse(player_view);
			loc = cast.location;
			dim = cast.dimension;
			if(modifier.ongoing && (system.currentTick % modifier.ongoing.delay == 0 || modifier.ongoing.delay == 0 || modifier.ongoing.delay == undefined)) modifier.ongoing.id(cast, modifier.ongoing.modifier);
		}catch(err){
			system.clearRun(run_id);
			if(modifier.impact){
				if(modifier.impact.particles != undefined) dim.spawnParticle(modifier.impact.particles, loc, particleMap);
				modifier.impact.id(createDummySource(source.dimension, loc), modifier.impact.modifier);
			}
			return;
		}
		countdown--;
	});
	return cast;
};

export function castSpellAtView(source, modifier){
	if(modifier.impact){
		modifier.impact.modifier.actor = modifier.actor;
		modifier.impact.modifier.item = modifier.item;
		modifier.impact.modifier.source = source;
	}
	
	let player_view = source.getViewDirection();
	let cast_loc = source.getHeadLocation();
	let target = source.getEntitiesFromViewDirection({maxDistance: modifier.range})[0];

	if(target == undefined){
		let loc = source.getBlockFromViewDirection({maxDistance: modifier.range});
		if(loc == undefined){
			loc = { x: player_view.x*modifier.range/2 + cast_loc.x, y: player_view.y*modifier.range/2 + cast_loc.y, z: player_view.z*modifier.range/2 + cast_loc.z};
		}else{
			loc = Vector.add(loc.block.location, loc.faceLocation);
		}
		target = createDummySource(source.dimension, loc, player_view);
	}else{
		target = target.entity;
	}
	if(modifier.set_to_floor){
		let loc = source.dimension.getBlockFromRay(target.location, { x: 0, y: -1, z: 0 }, { includePassableBlocks: false });
		loc = Vector.add(loc.block.location, loc.faceLocation);
		target = createDummySource(source.dimension, loc, player_view);
	}
	
	if(modifier.create_new_source && target.id != -1 && !modifier.set_to_floor) target = createDummySource(source.dimension, target.location, player_view);

	if(modifier.impact.particles != undefined) dim.spawnParticle(modifier.impact.particles, loc, particleMap);
	modifier.impact.id(target, modifier.impact.modifier);
};