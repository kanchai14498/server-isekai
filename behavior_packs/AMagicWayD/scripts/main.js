import { world, system, ItemStack, MolangVariableMap } from "@minecraft/server";
import { Vector } from "./Vector3";
import { setFastSwap } from "./fast_swap";
import * as MagicList from "./magic_list";
import * as ItemData from "./item_list";
import * as SpellDB from "./spell_book_database";
import * as MagicAttributeDB from "./magic_attributes_database";

import "./spell_binding_table";
import "./magic_reinforcement_table";
import "./entity_property";
import "./magic_learning_station";

let spell_count = 0;
let spell_total = Object.keys(ItemData.getScrolls()).length;
for(let item of Object.keys(ItemData.getScrolls())){
	if(MagicList.magic_data[ItemData.getScrolls()[item]] == undefined){
		// console.warn(ItemData.getScrolls()[item] + " NOT DEFFINED SPELL!");
		spell_count++;
	}
}
console.warn("spell list count = " + spell_total + " / " + spell_count)

const SpellParticleColor = {
	default: new MolangVariableMap(),
	nature: new MolangVariableMap(),
	fire: new MolangVariableMap(),
	void: new MolangVariableMap(),
	dark: new MolangVariableMap(),
	water: new MolangVariableMap(),
	thunder: new MolangVariableMap(),
	wind: new MolangVariableMap(),
	light: new MolangVariableMap(),
	ice: new MolangVariableMap()
}

SpellParticleColor.default.setColorRGBA("variable.color", { red: 1, green: 1, blue: 1, alpha: 1});
SpellParticleColor.nature.setColorRGBA("variable.color", { red: 0.5, green: 0.6, blue: 0.44, alpha: 1});
SpellParticleColor.fire.setColorRGBA("variable.color", { red: 1.0, green: 0.4, blue: 0.04, alpha: 1});
SpellParticleColor.void.setColorRGBA("variable.color", { red: 0.5, green: 0.25, blue: 0.8, alpha: 1});
SpellParticleColor.dark.setColorRGBA("variable.color", { red: 0.35, green: 0.25, blue: 0.35, alpha: 1});
SpellParticleColor.water.setColorRGBA("variable.color", { red: 0.15, green: 0.75, blue: 1.0, alpha: 1});
SpellParticleColor.thunder.setColorRGBA("variable.color", { red: 0.15, green: 1.0, blue: 0.8, alpha: 1});
SpellParticleColor.wind.setColorRGBA("variable.color", { red: 0.45, green: 1.0, blue: 0.52, alpha: 1});
SpellParticleColor.light.setColorRGBA("variable.color", { red: 1.0, green: 0.85, blue: 0.53, alpha: 1});
SpellParticleColor.ice.setColorRGBA("variable.color", { red: 0.7, green: 0.92, blue: 1.0, alpha: 1});

var magic_data = MagicList.magic_data;
var magic_index = Object.keys(magic_data);

system.afterEvents.scriptEventReceive.subscribe( s => {
	if(s.id == "amw:command" && s.message == "get_all_spell"){
		let a = new ItemStack("amw:grimore", 1);
		SpellDB.setupSpellBook(a, 1);
		SpellDB.addSpell(a, magic_index);
		s.sourceEntity.dimension.spawnItem(a, s.sourceEntity.location)
	}
}, { namespaces: [ "amw" ]});
/*
var unregistered_magic = [];
var registered_spell = {};
var event_list = {};
for(let a of magic_index){
	event_list[a] = {};
	let id = "amw:" + a + "_scroll";
	registered_spell[id] = a;
	if(ItemData.getScrolls()[id] == undefined) unregistered_magic.push(a)
}

console.warn("unregistered_magic")
console.warn(unregistered_magic)
console.warn(JSON.stringify(magic_index))
console.warn("magic count: " + magic_index.length)
console.warn(JSON.stringify(registered_spell))
console.warn(JSON.stringify(event_list))
/*
let item_data = Object.keys(ItemData.getSpellBooks());
let data = ""

for(let a of item_data){
	data += "item." + a + "=" + ItemData.getSpellBooks()[a].name + "\n"
}
item_data = Object.keys(MagicList.magic_data);

for(let a of item_data){
	data += "item.amw:" + a + "_scroll=" + MagicList.magic_data[a].name + " Scroll\n"
}
console.warn("RETURN LANG :\n" + data)*/

const ParticleMap = new MolangVariableMap();

var player_ui_temp = {};
var player_ui_data = {};
var player_casting = {};
var player_spell_cooldown = {};
// var player_dimension = {};
var player_menu_path = {};
var player_display_magic = {};
var player_hand_cast = {};
var main_object_name = {};
var player_soul_score = {};
var player_change_slot_rotation = {};
var player_slot_rotation = {};
var is_using_spell = {};
let target_swap_offset = {};
var soul_objective = world.scoreboard.getObjective("amw:soul");

const USE_OLD_SWAP = false;

if(soul_objective == undefined){
	soul_objective = world.scoreboard.addObjective("amw:soul", "Player Soul");
}
var player_attributes = {
	"default": {
		soul_capacity: 0,
		soul_return: 0,
		cast_efficiency: 0,
		soul_efficiency: 0,
		fire_mastering: 0,
		fire_magic: 0,
		water_mastering: 0,
		water_magic: 0,
		nature_mastering: 0,
		nature_magic: 0,
		ice_mastering: 0,
		ice_magic: 0,
		void_mastering: 0,
		void_magic: 0,
		dark_mastering: 0,
		dark_magic: 0,
		light_mastering: 0,
		light_magic: 0,
		wind_mastering: 0,
		wind_magic: 0,
		thunder_mastering: 0,
		thunder_magic: 0
	}
};

const MagicToAttributeList = {
    "fire": "fire_magic",
    "water": "water_magic",
    "nature": "nature_magic",
    "ice": "ice_magic",
    "void": "void_magic",
    "dark": "dark_magic",
    "light": "light_magic",
    "wind": "wind_magic",
    "thunder": "thunder_magic"
}

const MagicAttributeList = [
    "fire",
    "water",
    "nature",
    "ice",
    "void",
    "dark",
    "light",
    "wind",
    "thunder"
]

const AttributeList = [
    "soul_capacity",
    "fire_magic",
    "water_magic",
    "nature_magic",
    "ice_magic",
    "void_magic",
    "dark_magic",
    "light_magic",
    "wind_magic",
    "thunder_magic"
]

let player_efficiency = {}

export function setCooldown(id, value){
	if(player_ui_data[id] == undefined) return;
	player_ui_data[id].spell_cooldown = Math.max(0, value);
}

function getMagicAttribures(player) {
    if (player.typeId != "minecraft:player") {
        if (player_attributes[player.typeId] == undefined) {
            return {
                soul_capacity: 0,
                fire_magic: 0,
                water_magic: 0,
                nature_magic: 0,
                ice_magic: 0,
                void_magic: 0,
                dark_magic: 0,
                light_magic: 0,
                wind_magic: 0,
                thunder_magic: 0
            };
        } else {
            return player_attributes[player.typeId];
        }
    }

    let random_soul;

    const soulTag = player.getTags().find(tag => tag.startsWith("soul_capacity:"));

    if (soulTag) {
        random_soul = parseInt(soulTag.split(":")[1]);
    } else {
        random_soul = Math.floor(Math.random() * (750 - 50 + 1)) + 50;

        // สุ่มเลข 1-20
        const random_number = Math.floor(Math.random() * (20 - 1 + 1)) + 1;

        // ถ้าได้เลข 20 ให้คูณค่า random_soul ด้วย 10
        if (random_number === 20) {
            random_soul *= 10;
        }

        player.addTag(`soul_capacity:${random_soul}`);
    }

    player_attributes[player.id] = {
        soul_capacity: random_soul,
        fire_magic: 0,
        water_magic: 0,
        nature_magic: 0,
        ice_magic: 0,
        void_magic: 0,
        dark_magic: 0,
        light_magic: 0,
        wind_magic: 0,
        thunder_magic: 0
    };

    let equipment = player.getComponent("minecraft:equippable");

    let equipment_list = [
        equipment.getEquipmentSlot("Mainhand"),
        equipment.getEquipmentSlot("Offhand")
    ];

    for (let item of equipment_list) {
        let item_attributes = MagicAttributeDB.getMagicAttributeData(item, false);

        for (let attribute of AttributeList) {
            player_attributes[player.id][attribute] = Math.min(
                player_attributes[player.id][attribute] + item_attributes[attribute],
                attribute == "soul_capacity" ? 7500 : 10
            );
        }
    }

    return player_attributes[player.id];
}




const GradeToInt = {
	basic: 0,
	intermediate: 1,
	advance: 2,
	expert: 3,
	master: 4
}

function magic_modifier(id, data){
	let temp = {};
	let keys = Object.keys(data);
	if(keys.includes("magic_attributes")){
		let modifier = 0;
		for(let attribute of data.magic_attributes){
			let value = player_attributes[id][attribute.magic_type]*attribute.multiply + attribute.additive;
			if(attribute.multiply <= 0.0) value = Math.max(0, value);
			modifier += value;
			if(attribute.to_int) modifier = parseInt(modifier);
		}
		return modifier;
	}
	for(let key of keys){
		if(Array.isArray(data[key])){
			temp[key] = [];
			for(let arr of data[key]){
				if(typeof arr === 'object' && !Array.isArray(arr)){
					temp[key].push(magic_modifier(id, arr));
				}else{
					temp[key].push(arr);
				}
			}
		}else{
			if(typeof data[key] === 'object'){
				temp[key] = magic_modifier(id, data[key]);
			}else{
				temp[key] = data[key];
			}
		}
	}
	return temp;
}

function loadMagicFunction(source, modifier){
	modifier.function(source, modifier.modifier);
}

world.afterEvents.itemStartUse.subscribe( s => {
	if(ItemData.getCastWeapons()[s.itemStack.typeId] != undefined) s.source.playAnimation("animation.humanoid.magic.interact_spell", {
		blendOutTime: 0.1,
		stopExpression: "!query.is_using_item",
		controller: "casting" 
	});
	if(player_display_magic[s.source.id] == undefined || player_hand_cast[s.source.id] == undefined || is_using_spell[s.source.id]) return;
	
	
	let durability = s.itemStack.getComponent("minecraft:durability");
	let attributes = getMagicAttribures(s.source);

	if(durability.damage == durability.maxDurability){
		s.source.onScreenDisplay.setActionBar("Cannot Use This Casting Weapon!")
		return;
	}

	
	if(s.source.isSneaking || main_object_name[s.source.id] != "none"){
		s.source.playAnimation("animation.humanoid.magic.casting", {
			blendOutTime: 0.1,
			stopExpression: "!query.is_using_item",
			controller: "casting" 
		});
		s.source.playAnimation("animation.item_hand.casting", {
			blendOutTime: 0.1,
			stopExpression: "!query.is_using_item",
			controller: "casting_fpp" 
		});
	}

	let rotation = s.source.getRotation();
	if(s.source.isSneaking){
		if(player_hand_cast[s.source.id]["fast_swap"] != undefined && USE_OLD_SWAP){
			player_change_slot_rotation[s.source.id] = rotation;
			let offset = Vector.multiply(s.source.getViewDirection(), 5);
			let temp = s.source.dimension.spawnEntity("amw:target_swap", Vector.add(s.source.getHeadLocation(), offset));
			temp.playAnimation("animation.general.invisible_root", {
				blendOutTime: 0.25
			});

			target_swap_offset[s.source.id] = {
				offset: offset,
				entity: temp,
				dimension_id: s.source.dimension.id
			}
		}
		if(player_hand_cast[s.source.id]["fast_swap"] != undefined && !USE_OLD_SWAP){
			let equipment = s.source.getComponent("minecraft:equippable");
	
			let spell_book;
			let offhand = equipment.getEquipmentSlot("Offhand");
			let mainhand = equipment.getEquipmentSlot("Mainhand");
			
			if(offhand.getItem() && ItemData.getSpellBooks()[offhand.typeId] != undefined){
				spell_book = offhand;
			}
			if(mainhand.getItem() && !spell_book && ItemData.getSpellBooks()[mainhand.typeId] != undefined){
				spell_book = mainhand;
			}

			if(SpellDB.getSpellData(spell_book).spell.length > 1) setFastSwap(s.source, spell_book);
		}
	}else{
		if(player_spell_cooldown[s.source.id]){
			let get_blocked_data = player_spell_cooldown[s.source.id][main_object_name[s.source.id]];
			if(get_blocked_data != undefined && system.currentTick < get_blocked_data){
				s.source.onScreenDisplay.setActionBar("Cannot Cast This Spell!")
				return;
			}
		}
		if(main_object_name[s.source.id] == "none") return;
		player_casting[s.source.id] = system.currentTick;
	}
	if(main_object_name[s.source.id] == "none") return;
	player_ui_data[s.source.id].spell_cooldown = 53;

	let point = 0;
	let max_point = 0;

	for(let attribute of magic_data[main_object_name[s.source.id]].attribute){
		if(MagicAttributeList.includes(attribute)){
			point += attributes[MagicToAttributeList[attribute]];
			max_point += 10;
		}
	}

	player_efficiency[s.source.id] = {
		cast_efficiency: (point / max_point) * 0.4,
		soul_efficiency: (point / max_point) * 0.5
	}

	let soul_cost = magic_data[main_object_name[s.source.id]].soul_cost;
	soul_cost *= ItemData.getCastWeapons()[s.itemStack.typeId].soul_efficiency - player_efficiency[s.source.id].soul_efficiency;
	let current_soul = soul_objective.getScore(s.source);

	if(current_soul < soul_cost){
		player_ui_data[s.source.id].header = 'b';
	}else{
		player_ui_data[s.source.id].header = 'a';
	}
});

world.afterEvents.itemStopUse.subscribe( s => {
	delete player_casting[s.source.id];
	if(USE_OLD_SWAP) delete player_change_slot_rotation[s.source.id];
	player_ui_data[s.source.id].spell_wheel = 99;

	if(target_swap_offset[s.source.id]){ 
		target_swap_offset[s.source.id].entity.remove();
		delete target_swap_offset[s.source.id];
	}
	
	if(player_spell_cooldown[s.source.id]){
		let get_blocked_data = player_spell_cooldown[s.source.id][main_object_name[s.source.id]];
		if(get_blocked_data != undefined && system.currentTick < get_blocked_data){
			return;
		}
	}
	player_ui_data[s.source.id].spell_cooldown = 0;
	player_ui_data[s.source.id].header = 'a';
});

world.afterEvents.itemReleaseUse.subscribe( s => {
	if(player_display_magic[s.source.id] == undefined || player_hand_cast[s.source.id] == undefined) return;
	if(s.source.isSneaking && (player_hand_cast[s.source.id]["fast_swap"] == undefined || (player_hand_cast[s.source.id]["fast_swap"] && USE_OLD_SWAP))){
		let equipment = s.source.getComponent("minecraft:equippable");
		let grimore;
		let slot;
		let offhand = equipment.getEquipment("Offhand");
		let mainhand = equipment.getEquipment("Mainhand");
		if(offhand && ItemData.getSpellBooks()[offhand.typeId] != undefined){
			grimore = offhand.clone();
			slot = "Offhand";
		}
		if(mainhand && !grimore && ItemData.getSpellBooks()[mainhand.typeId] != undefined){
			grimore = mainhand.clone();
			slot = "Mainhand";
		}

		let spell_book = equipment.getEquipmentSlot(slot);
		let spell_book_data = SpellDB.getSpellData(spell_book);
		let slot_index = 0;

		if(player_change_slot_rotation[s.source.id] != undefined && USE_OLD_SWAP){
			let select = parseInt((player_slot_rotation[s.source.id] + 2) / 4) % 9;
			slot_index = select;
			if(select < spell_book_data.spell.length){
				SpellDB.setSpellSlot(spell_book, select);
			}else{
				return;
			}
			
		}else{
			slot_index = ((spell_book_data.slot_id + 1) % spell_book_data.spell.length);
			SpellDB.setSpellSlot(spell_book, slot_index);
		}
		s.source.startItemCooldown("cast", 0);
		s.source.playSound("item.book.page_turn", { pitch: 1.1, volume: 1 });


		if(player_spell_cooldown[s.source.id]){
			let get_blocked_data = player_spell_cooldown[s.source.id][spell_book_data.spell[slot_index]];
			if(get_blocked_data != undefined && system.currentTick < get_blocked_data){
				system.runTimeout(()=>{
					player_ui_data[s.source.id].spell_cooldown = 52;
				}, 1);
			}
		}
		return;	
	}
	
	if(main_object_name[s.source.id] == "none") return;

	const modifier_clone = Object.create(magic_data[main_object_name[s.source.id]]);

	if(modifier_clone == undefined) return;

	modifier_clone.modifier = magic_modifier(s.source.id, modifier_clone.modifier)
	modifier_clone.modifier.item = s.itemStack;
	modifier_clone.modifier.actor = s.source;

	let mainhand = s.itemStack;
	let player_scoreboard = soul_objective.getScore(s.source);
	let soul_cost = modifier_clone.soul_cost;

	if(player_casting[s.source.id] == undefined || modifier_clone.function == undefined) return;
	let cast_duration = modifier_clone.cast_duration;
	if(player_attributes[s.source.id] != undefined){
		cast_duration *= ItemData.getCastWeapons()[mainhand.typeId].cast_efficiency - player_efficiency[s.source.id].cast_efficiency;
		soul_cost *= ItemData.getCastWeapons()[mainhand.typeId].soul_efficiency - player_efficiency[s.source.id].soul_efficiency;
	}else{
		cast_duration *= ItemData.getCastWeapons()[mainhand.typeId].cast_efficiency;
		soul_cost *= modifier_clone.soul_cost;
	}
	if(system.currentTick - player_casting[s.source.id] <= cast_duration + 2){
		return;
	}else{
		if(player_scoreboard < soul_cost){
			s.source.sendMessage("Not Enough Soul!");
			return;
		}
	}

	let item_temp = s.itemStack.clone();
	let durability = item_temp.getComponent("minecraft:durability");

	if(durability.damage == durability.maxDurability){
		s.source.getComponent("minecraft:equippable").setEquipment("Mainhand", undefined);
	}else{
		system.runTimeout(() => {
			durability.damage += 1;
			s.source.getComponent("minecraft:equippable").setEquipment("Mainhand", item_temp);
		});
	}

	system.runTimeout(()=>{
		loadMagicFunction(s.source, modifier_clone);
	});

	mainhand.getComponent("minecraft:cooldown").startCooldown(s.source);
	soul_objective.setScore(s.source, Math.max(player_scoreboard-soul_cost, 0));

	s.source.playAnimation("animation.humanoid.magic.casting_done", {
		blendOutTime: 0.1,
		stopExpression: "query.is_using_item",
		controller: "casting" 
	});
	s.source.playAnimation("animation.item_hand.casting_done", {
		blendOutTime: 0.1,
		stopExpression: "query.is_using_item",
		controller: "casting_fpp" 
	});
	s.source.playSound("block.enchanting_table.use", { pitch: 2, volume: 1 });
	s.source.playSound("random.orb", { pitch: 0.2, volume: 0.3 });
	s.source.playSound("random.orb", { pitch: 4, volume: 0.9 });
	s.source.playSound("beacon.power", { pitch: 4, volume: 0.5 });
	s.source.playSound("respawn_anchor.charge", { pitch: 0.2, volume: 0.15 });
	s.source.playSound("fall.amethyst_cluster", { pitch: 2, volume: 0.5 });
	s.source.playSound("mob.enderdragon.flap", { pitch: 2, volume: 0.15 });

	for(let type of modifier_clone.attribute){
		if(type == "fire"){
			s.source.playSound("mob.ghast.fireball", { pitch: 1.5, volume: 1 });
		}else if(type == "water"){
			s.source.playSound("bubble.upinside", { pitch: 2.5, volume: 1 });
			s.source.playSound("bubble.upinside", { pitch: 0.5, volume: 1 });
		}else if(type == "dark"){
			s.source.playSound("use.sculk_sensor", { pitch: 0.8, volume: 0.9 });
			s.source.playSound("power.on.sculk_sensor", { pitch: 0.5, volume: 0.7 });
			s.source.playSound("particle.soul_escape", { pitch: 0.9, volume: 1 });
		}else if(type == "light"){
			s.source.playSound("chime.amethyst_block", { pitch: 1.2, volume: 1 });
			s.source.playSound("chime.amethyst_block", { pitch: 0.4, volume: 1 });
			s.source.playSound("break.amethyst_cluster", { pitch: 0.2, volume: 1 });
		}else if(type == "wind"){
			s.source.playSound("component.jump_to_block", { pitch: 0.7, volume: 1 });
			s.source.playSound("mob.enderdragon.flap", { pitch: 0.4, volume: 0.35 });
		}else if(type == "thunder"){
			s.source.playSound("item.trident.return", { pitch: 0.9, volume: 1 });
			s.source.playSound("mob.endermite.say", { pitch: 2, volume: 1 });
			s.source.playSound("mob.spider.death", { pitch: 6, volume: 1 });
		}else if(type == "void"){
			s.source.playSound("mob.shulker.teleport", { pitch: 0.6, volume: 1 });
			s.source.playSound("respawn_anchor.ambient", { pitch: 3, volume: 1 });
			s.source.playSound("beacon.power", { pitch: 0.6, volume: 0.2 });
		}else if(type == "nature"){
			s.source.playSound("block.composter.fill_success", { pitch: 0.7, volume: 1 });
			s.source.playSound("block.chorusflower.death", { pitch: 0.8, volume: 1 });
			s.source.playSound("land.grass", { pitch: 0.5, volume: 1 });
		}
	}
});

world.afterEvents.itemUse.subscribe(s=>{
	if(ItemData.getSpellBooks()[s.itemStack.typeId] && !ItemData.getCastWeapons()[s.itemStack.typeId]){
		let equip = s.source.getComponent("minecraft:equippable");
		let offhand_item = equip.getEquipment("Offhand");
		let mainhand_item = equip.getEquipment("Mainhand");

		equip.setEquipment("Offhand", mainhand_item);
		equip.setEquipment("Mainhand", offhand_item);
	}
})

system.afterEvents.scriptEventReceive.subscribe( s => {
	if(s.id == "amw:cast"){
		let spell_id = s.message;
		
		const modifier_clone = Object.create(magic_data[spell_id]);

		if(modifier_clone == undefined) return;
		let id = "default";
		let item = undefined;
		if(s.sourceEntity.typeId == "minecraft:player"){
			id = s.sourceEntity.id;
			let attributes = getMagicAttribures(s.sourceEntity);
		}
		if(s.sourceEntity.hasComponent("minecraft:equippable")) item = s.sourceEntity.getComponent("minecraft:equippable").getEquipment("Mainhand");
		
		modifier_clone.modifier = magic_modifier(id, modifier_clone.modifier)
		modifier_clone.modifier.actor = s.sourceEntity;
		modifier_clone.modifier.item = item;
		loadMagicFunction(s.sourceEntity, modifier_clone);
	}else if(s.id == "amw:enr"){
		if(s.message == "reset tree") s.sourceEntity.setDynamicProperty("amw:enr", "default");
	}else if(s.id == "amw:spell"){
		if(s.message == "active"){
			is_using_spell[s.sourceEntity.id] = true;
		}else if(s.message == "deactive"){
			delete is_using_spell[s.sourceEntity.id];
		}
	}else if(s.id == "amw:cooldown"){
		let data = s.message.split(" ");
		if(player_spell_cooldown[s.sourceEntity.id] == undefined) player_spell_cooldown[s.sourceEntity.id] = {};

		player_spell_cooldown[s.sourceEntity.id][data[0]] = data[1];
		
		player_ui_data[s.sourceEntity.id].spell_cooldown = 52;
	}else if(s.id == "amw:add"){
		let data = s.message.toLowerCase().split(" ");
		let added_spells = [];
		for(let spell of magic_index){
			if(spell == "none") continue;
			let magic = MagicList.magic_data[spell];

			for(let search of data){
				if(spell == search || magic.grade == search || magic.type == search || magic.attribute.includes(search) || magic.name.toLowerCase().includes(search)){
					added_spells.push(spell);
					break;
				}
			}
		}

		let equip = s.sourceEntity.getComponent("minecraft:equippable");

		let main_hand = equip.getEquipmentSlot("Mainhand");

		if(ItemData.getSpellBooks()[main_hand.typeId]) SpellDB.addSpell(main_hand, added_spells);
	}

}, {namespaces: ["amw"]});

system.runInterval(() => {
	let tick = system.currentTick;
	let player_list = {
		"minecraft:overworld": [],
		"minecraft:nether": [],
		"minecraft:the_end": []
	};
	for(let playerData of world.getPlayers()){
		player_list[playerData.dimension.id].push(playerData.name);

		// let block = playerData.getBlockFromViewDirection();
		// if(block){
		// 	playerData.getComponent("minecraft:equippable").setEquipment("Mainhand", block.block.permutation.getItemStack())
		// 	console.warn(JSON.stringify(block.block.permutation.getAllStates()))
		// }
	}

	for(let playerData of world.getPlayers()){
		if(player_attributes[playerData.id] == undefined){
			getMagicAttribures(playerData)
			player_efficiency[playerData.id] = {
				cast_efficiency: 0,
				soul_efficiency: 0
			}
		}
		if(player_ui_data[playerData.id] == undefined){
			player_ui_temp[playerData.id] = ""
			player_ui_data[playerData.id] = {
				header: 'a',
				spell_select: 0,
				spell_cooldown: 0,
				spell_wheel: 99,
				casting_duration: 0,
				soul_capacity: 0
			}
		}else{
			let text = (player_ui_data[playerData.id].header + 
				player_ui_data[playerData.id].spell_select.toString() + 
				player_ui_data[playerData.id].spell_cooldown.toString().padStart(2, '0') + 
				player_ui_data[playerData.id].spell_wheel.toString().padStart(2, '0') +
				player_ui_data[playerData.id].casting_duration.toString().padStart(2, '0') + 
				player_ui_data[playerData.id].soul_capacity.toString().padStart(2, '0'));

			if(text != player_ui_temp[playerData.id]){
				playerData.runCommand("scriptevent ui:set " + text + " magic_ui_update");
				player_ui_temp[playerData.id] = text;
			}
		}
		
		let player_scoreboard = 0;
		try{
			player_scoreboard = soul_objective.getScore(playerData);
		}catch(err) {
			console.warn(playerData.name + " has no soul, creating new data!")
			player_scoreboard = soul_objective.addScore(playerData, 0);
		}

		if(player_scoreboard == undefined) player_scoreboard = soul_objective.addScore(playerData, 0);
		let max_soul_capacity = player_attributes[playerData.id].soul_capacity;
		
		if(tick % 15 == 0){
			getMagicAttribures(playerData);
			if(player_scoreboard < max_soul_capacity) soul_objective.setScore(playerData, Math.min(player_scoreboard+1, max_soul_capacity));
		}

		if(target_swap_offset[playerData.id]){ 
			if(target_swap_offset[playerData.id].dimension_id != playerData.dimension.id){
				target_swap_offset[playerData.id].entity.remove();
				delete target_swap_offset[playerData.id];
			}else{
				target_swap_offset[playerData.id].entity.teleport(Vector.add(playerData.getHeadLocation(), target_swap_offset[playerData.id].offset));
				let players_unlist = [];
				for(let name of player_list[playerData.dimension.id]){
					if(playerData.name != name) players_unlist.push(name);
				}
				
				target_swap_offset[playerData.id].entity.playAnimation("animation.general.invisible_root", {
					players: players_unlist
				});
			}
		}

		player_ui_data[playerData.id].soul_capacity = Math.min(parseInt(player_scoreboard / max_soul_capacity * 99), 99);

		if(!playerData.isSneaking && player_casting[playerData.id] != undefined && tick - player_casting[playerData.id] > 3){
			let view = playerData.getViewDirection();
			view.x *= 2;
			view.y *= 2;
			// view.y -= 0.2;
			view.z *= 2;
			let pos = Vector.add(playerData.getHeadLocation(), view);
			let map = SpellParticleColor.default;
			for(let attribute of magic_data[main_object_name[playerData.id]].attribute){
				if(SpellParticleColor[attribute] != undefined){
					map = SpellParticleColor[attribute];
					break;
				}
			}
			if(tick % 2 == 0){
				playerData.dimension.spawnParticle("magic:spell_particle", pos, map);
			}
			if(tick % 4 == 0){
				playerData.dimension.spawnParticle("magic:spell_circle", pos, map);
				playerData.dimension.spawnParticle("amw:casting_effect_particle", pos, ParticleMap);
			}
			if(tick % 10 == 0){
				playerData.dimension.spawnParticle("magic:spell_trail", pos, map);
			}
			playerData.dimension.spawnParticle("magic:spell_light", pos, map);
			
			playerData.playSound("step.cloth", { pitch: 0.35, volume: 0.5 });
			if(tick % 6 == 0) {
				playerData.playSound("step.amethyst_cluster", { pitch: 0.3, volume: 0.5 });
				playerData.playSound("fire.fire", { pitch: 2, volume: 0.5 });
			}
			if(tick % 3 == 0){
				playerData.playSound("step.amethyst_cluster", { pitch: 2, volume: 0.4 });
				playerData.playSound("beacon.ambient", { pitch: 4, volume: 0.8 });
			}
		}
		
		let equipment = playerData.getComponent("minecraft:equippable");

		let grimore;
		let path = 0;
		let offhand = equipment.getEquipmentSlot("Offhand");
		let mainhand = equipment.getEquipmentSlot("Mainhand");
		
		if(offhand.getItem() && ItemData.getSpellBooks()[offhand.typeId] != undefined){
			grimore = offhand;
		}
		if(mainhand.getItem() && !grimore && ItemData.getSpellBooks()[mainhand.typeId] != undefined){
			grimore = mainhand;
		}

		if(grimore && mainhand.getItem() && ItemData.getCastWeapons()[mainhand.typeId] != undefined){
			player_hand_cast[playerData.id] = ItemData.getCastWeapons()[mainhand.typeId];
		}else{
			delete player_hand_cast[playerData.id];
		}

		if(grimore){
			if(player_display_magic[playerData.id] == undefined){
				player_display_magic[playerData.id] = {
					main: -1,
					data: "",
					cooldown: -1
				};
			};
			if(playerData.isSneaking){
				path = 2;
			}else{
				path = 1;
			}
		}else{
			delete player_display_magic[playerData.id];
		}
		if(path != player_menu_path[playerData.id]){
			player_ui_data[playerData.id].spell_select = path;
			player_menu_path[playerData.id] = path;
		}
		
		if(!grimore){
			delete player_display_magic[playerData.id];
			continue;
		}
		

		let spell_book_data = SpellDB.getSpellData(grimore);
		if(spell_book_data == undefined) spell_book_data = SpellDB.setupSpellBook(grimore);

		if(player_spell_cooldown[playerData.id]){
			let get_blocked_data = player_spell_cooldown[playerData.id][main_object_name[playerData.id]];
			if(get_blocked_data != undefined && system.currentTick < get_blocked_data){
				player_ui_data[playerData.id].spell_cooldown = 52;
			}else{
				delete player_spell_cooldown[playerData.id][main_object_name[playerData.id]];
				player_ui_data[playerData.id].spell_cooldown = 0;
			}
		}

		let magic_list;
		let raw_lore;
		if(spell_book_data != undefined){
			magic_list = spell_book_data.spell;
			raw_lore = JSON.stringify(spell_book_data.spell) + spell_book_data.slot_id;
		}
		
		if(player_change_slot_rotation[playerData.id] != undefined && USE_OLD_SWAP){
			let rotation = playerData.getRotation();

			// let r_a = new Vector(player_change_slot_rotation[playerData.id].x, player_change_slot_rotation[playerData.id].y, 0);

			// if(Vector.distance(r_a, { x: rotation.x, y: rotation.y, z: 0 }) > 0.1){
				rotation.x -= player_change_slot_rotation[playerData.id].x;
				rotation.y -= player_change_slot_rotation[playerData.id].y;
				if(rotation.y > 180) rotation.y = rotation.y - 360;
				if(rotation.y < -180) rotation.y = rotation.y + 360;
				
				let render_dir = ((Math.atan2(rotation.y / 180, -rotation.x / 180) / Math.PI * 180 + 360) % 360) / 10;
				player_ui_data[playerData.id].spell_wheel = parseInt(render_dir / 36 * 98);
				render_dir = parseInt(render_dir);
				
				let current_spell_select = parseInt(render_dir / 36 * 9 + 0.5) % 9;
				
				if(magic_data[magic_list[current_spell_select]] != undefined) {
					playerData.runCommand("scriptevent ui_load:spell_name_update " + magic_data[magic_list[current_spell_select]].name + "spell_name_update");
				}else{
					playerData.runCommand("scriptevent ui_load:spell_name_update spell_name_update");
				}
	
				player_slot_rotation[playerData.id] = render_dir;

			// 	playerData.teleport(playerData.location, {
			// 		rotation: player_change_slot_rotation[playerData.id]
			// 	})
			// }
		}
		if(!playerData.isSneaking){
			player_ui_data[playerData.id].spell_wheel = 99;
		}

		if(raw_lore == undefined){
			player_ui_data[playerData.id].spell_select = 0;
			player_menu_path[playerData.id] = "none";
		}else{
			let grimore_hand_slot_id = spell_book_data.slot_id;
			main_object_name[playerData.id] = magic_list[grimore_hand_slot_id];
			if(player_display_magic[playerData.id].main != grimore_hand_slot_id || raw_lore != player_display_magic[playerData.id].data ){
				// console.warn(raw_lore)
				playerData.runCommand("scriptevent ui:set " + magic_data[main_object_name[playerData.id]].path + " magic_main");
				if(grimore_hand_slot_id < magic_list.length-1){
					playerData.runCommand("scriptevent ui:set " + magic_data[magic_list[grimore_hand_slot_id+1]].path + " magic_right");
				}else if(magic_list.length == 1){
					playerData.runCommand("scriptevent ui:set textures/ui/blank magic_right");
				}else{
					playerData.runCommand("scriptevent ui:set " + magic_data[magic_list[0]].path + " magic_right");
				}
				if(grimore_hand_slot_id > 0){
					playerData.runCommand("scriptevent ui:set " + magic_data[magic_list[grimore_hand_slot_id-1]].path + " magic_left");
				}else if(magic_list.length == 1){
					playerData.runCommand("scriptevent ui:set textures/ui/blank magic_left");
				}else{
					playerData.runCommand("scriptevent ui:set " + magic_data[magic_list[magic_list.length-1]].path + " magic_left");
				}
				player_display_magic[playerData.id].data = raw_lore;
				player_display_magic[playerData.id].main = grimore_hand_slot_id;
				playerData.runCommand("scriptevent ui_load:magic_name_update " + magic_data[main_object_name[playerData.id]].name + "magic_name_update");

				for(let spell_index = 0; spell_index < 9; spell_index++){
					if(magic_list[spell_index] == undefined){
						playerData.runCommand("scriptevent ui:set disable spell_render_" + spell_index + "_update");
					}else{
						playerData.runCommand("scriptevent ui:set " + magic_data[magic_list[spell_index]].path + " spell_render_" + spell_index + "_update");
					}
				}
			}
		}

		if(mainhand.getItem() != undefined && ItemData.getCastWeapons()[mainhand.typeId] != undefined && main_object_name[playerData.id] != undefined){
			let cast_duration = magic_data[main_object_name[playerData.id]].cast_duration;
			if(player_attributes[playerData.id] != undefined){
				cast_duration *= ItemData.getCastWeapons()[mainhand.typeId].cast_efficiency - player_efficiency[playerData.id].cast_efficiency;
			}else{
				cast_duration *= ItemData.getCastWeapons()[mainhand.typeId].cast_efficiency;
			}

			if(player_casting[playerData.id] != undefined && !playerData.isSneaking){
				let cooldown = tick - player_casting[playerData.id];
				cooldown /= cast_duration;
				player_ui_data[playerData.id].casting_duration = Math.min(parseInt(cooldown*98), 99);
			}else{
				player_ui_data[playerData.id].casting_duration = 0;
			}
			if(player_casting[playerData.id] != undefined && tick - player_casting[playerData.id] >= cast_duration){
				player_ui_data[playerData.id].spell_cooldown = 51;
			}
		}else{
			player_ui_data[playerData.id].casting_duration = 0;
		}

		// let a = grimore.clone();
		// a.setLore(["§r§9Magic List:\nMain Slot: 1\n - None\n - None\n - None\n - None\n - None\n - None\n - None\n - None"])
		// playerData.dimension.spawnItem(a, playerData.location)

		// let a = grimore.clone();
		// a.setLore(["§r§9Magic List:\nMain Slot: 1\n - Lightning Bolt\n - None\n - Flight\n - Fire Breath\n - Poltergeist\n - Tornado\n - Explosion\n - Blink\n - Dirt Wall\n - Self Healing\n - Blessing\n - Fire Obelisk\n - Levitate\n - Decoy Obelisk\n - Purify\n - Thunder Streak\n - Orb Of Thunder\n - Fireball\n - Light Beam\n - Sonic Boom\n - Bubble Trap\n - Evoker Fang\n - Wind Blows\n - Absolute Area\n - Ice Shard\n - Light Judgement\n - Snowball Burst\n - Spider Climb\n - Astral Mount\n - Possesion\n - Fire Bullet\n - Convert Soul\n - Book Of Healing\n - Lava Land\n - Area Heals\n - Multiple Fire Bullet\n - Water Pudding\n - Meteor Rain\n - Burst Of Light\n - Self Rewind\n - Tentacle\n - Teleport\n - Alternate Damage\n - Water Fountain"])
		// playerData.dimension.spawnItem(a, playerData.location)

		// let a = grimore.clone();
		// a.setLore(["asddsa", "sasa", "iooiok"])
		// playerData.dimension.spawnItem(a, playerData.location)
	}
});

/*
[SPELL SELECTED 0-9][SPELL COOLDOWN 0-50][SPELL WHEEL 0-99][SOUL CAPACITY 0-99][CASTING DURATION 0-99]
1 22 33 44 55

*/