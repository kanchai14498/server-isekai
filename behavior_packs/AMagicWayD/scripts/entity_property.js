import { world, system, MolangVariableMap, BlockPermutation, ItemStack } from "@minecraft/server";
import { Vector } from "./Vector3";
import { openMagicLearningStation } from "./magic_learning_station";
import { DynamicLightLoader } from "./lib/DynamicLightSystem";

var dimension_list = [ world.getDimension("minecraft:overworld"), world.getDimension("minecraft:the_end"), world.getDimension("minecraft:nether") ];

// for(let i = 0; i < 100; i++){
//     if(dimension_list[0].runCommand("volumearea list").successCount == 0) break;
//     dimension_list[0].runCommand("volumearea remove amw:volume_" + i);
// }

var target_name_tag = [
    "spell_target"
];
const InfusedElectroBottle = new ItemStack("amw:infused_electro_bottle");
var start_tick = system.currentTick;
var register_player_id = [];
const particleMap = new MolangVariableMap();
const MagicEntity = [ "amw:magic_arrow", "amw:magic_thrown_trident", "amw:magic_iron_golem", "amw:magic_vex", "amw:armadillo_projectile", "amw:ice_chunk", "amw:dirt_wall", "amw:ice_spike", "amw:mjolnir", "amw:fire_obelisk", "amw:ancor", "amw:astral_mount", "amw:bees_army", "amw:decoy_obelisk", "amw:ice_sculpture", "amw:magic_skeleton", "amw:mutation_vines", "amw:tentacle", "amw:tornado", "amw:voodoo", "amw:fireflies_soul", "amw:magic_zombie" ]
const attributes = [ "minecraft:health", "minecraft:lava_movement", "minecraft:movement", "minecraft:underwater_movement" ];
const air_block = BlockPermutation.resolve("minecraft:air");
var soul_objective = world.scoreboard.getObjective("amw:soul");

const EntityCustomDrop = {
    "minecraft:stray": {
        "amw:frosted_bone": {
            min_quantity: 1,
            max_quantity: 2,
            rarity: 0.3
        }
    },
    "minecraft:evocation_illager": {
        "amw:evoker_fang_scroll": {
            min_quantity: 1,
            max_quantity: 1,
            rarity: 0.1
        }
    },
    "minecraft:wither_skeleton": {
        "amw:dark_magic_essence": {
            min_quantity: 1,
            max_quantity: 1,
            rarity: 0.1
        }
    },
    "minecraft:husk": {
        "amw:nature_magic_essence": {
            min_quantity: 1,
            max_quantity: 1,
            rarity: 0.1
        }
    },
    "minecraft:zombie": {
        "amw:dark_magic_essence": {
            min_quantity: 1,
            max_quantity: 1,
            rarity: 0.1
        }
    },
    "minecraft:drowned": {
        "amw:water_magic_essence": {
            min_quantity: 1,
            max_quantity: 1,
            rarity: 0.1
        }
    },
    "minecraft:guardian": {
        "amw:water_magic_essence": {
            min_quantity: 1,
            max_quantity: 2,
            rarity: 0.4
        }
    },
    "minecraft:elder_guardian": {
        "amw:water_magic_essence": {
            min_quantity: 3,
            max_quantity: 12,
            rarity: 0.8
        }
    }
}

DynamicLightLoader.addEntityLight("amw:soul_fragment", 4);
DynamicLightLoader.addEntityLight("amw:magic_orb", 9);
DynamicLightLoader.addEntityLight("amw:mjolnir", 9);
DynamicLightLoader.addEntityLight("amw:fireflies_soul", 9);
DynamicLightLoader.addEntityLight("amw:fire_obelisk", 14);
DynamicLightLoader.addEntityLight("amw:magic_fireball", 10);


var player_custom_effect = {};

var despawn_location = {
    "minecraft:overworld": [],
    "minecraft:nether": [],
    "minecraft:the_end": []
}
world.beforeEvents.worldInitialize.subscribe(s => {
    s.blockComponentRegistry.registerCustomComponent("amw:magic_reinforcement_table", {
        onPlace(e){
            let entity = e.dimension.spawnEntity("amw:magic_reinforcement_table", Vector.add(e.block.location, { x: 0.5, y: 1, z: 0.5 }));
            entity.nameTag = "amw:magic_reinforcement_table";
        }
    });
    s.blockComponentRegistry.registerCustomComponent("amw:spell_binding_table", {
        onPlace(e){
            let entity = e.dimension.spawnEntity("amw:spell_binding_table", Vector.add(e.block.location, { x: 0.5, y: 0.75, z: 0.5 }));
            entity.nameTag = "amw:spell_binding_table";
        }
    });
    s.blockComponentRegistry.registerCustomComponent("amw:magic_learning_station", {
        onPlace(e){
            e.dimension.spawnEntity("amw:floating_magic_book", Vector.add(e.block.location, { x: 0.5, y: 0.8, z: 0.5 }));
        },
        onPlayerInteract(e){
            openMagicLearningStation(e.player, e.block);
        }
    });
    s.blockComponentRegistry.registerCustomComponent("amw:light_source_block", {
        onTick(e){
            e.block.setPermutation(air_block);
        }
    });
});

system.afterEvents.scriptEventReceive.subscribe( s => {
	if(s.sourceEntity.typeId != "minecraft:player") return;
    if(s.id == "amw:effect"){
        let syntax = s.message.split(" ");
        syntax[1] = parseFloat(syntax[1]);
        let id = s.sourceEntity.id;
        player_custom_effect[id].is_update = true;
        player_custom_effect[id].effect[syntax[0]] = system.currentTick + syntax[1] * 20;
        if(syntax[1] * 20 > 200) system.runTimeout(()=>{
            player_custom_effect[id].is_update = true;
        }, syntax[1] * 20 - 200);

        system.runTimeout(()=>{
            player_custom_effect[id].is_update = true;
        }, syntax[1] * 20);
    }
}, {namespaces: ["amw"]});

// world.afterEvents.worldInitialize.subscribe( s => {
// 	let data = new DynamicPropertiesDefinition();
// 	data.defineString("amw:enr", 400, "default");
// 	data.defineNumber("amw:me", 0);
// 	data.defineNumber("amw:mp", 2);

// 	s.propertyRegistry.registerEntityTypeDynamicProperties(data, EntityTypes.get("minecraft:player"));
// });

world.beforeEvents.entityRemove.subscribe(s=>{
    if(!MagicEntity.includes(s.removedEntity.typeId)) return;
    let data = {
        location: s.removedEntity.location,
        is_ground: false
    }
    if(s.removedEntity.isOnGround) data.is_ground = true;

    despawn_location[s.removedEntity.dimension.id].push(data);
})

world.afterEvents.dataDrivenEntityTrigger.subscribe(s=>{
    if(!s.entity.isValid()) return;
    let location = s.entity.location;
    let count = parseInt(Math.random()*3) + 1;
    // console.warn(count)
    for(let i = 0; i < count; i++){
        let random = {
            x: Math.random()*2-1,
            y: 0,
            z: Math.random()*2-1
        }
        let entity = s.entity.dimension.spawnEntity("amw:soul_fragment", Vector.add(location, random));
        random.y = 1;
        entity.applyImpulse(Vector.multiply(random, 0.1));
    }
    s.entity.remove();

}, {eventTypes: [ "spawn_soul" ], entityTypes: [ "amw:trapped_soul_fragment" ] });

var startId = system.runInterval(() => {
    if(world.getPlayers().length > 0){
        for(let dimension of dimension_list){
            for(let entity of dimension.getEntities({ families: [ "magic" ] })){
                entity.remove();
            }
        }
        for(let dimension of dimension_list){
            for(let entity of dimension.getEntities({ excludeFamilies: [ "magic" ] })){
                let name = undefined;
                for(let tag of entity.getTags()){
                    if(target_name_tag.includes(tag.split(".")[0])){
                        name = tag;
                        break;
                    }
                }

                if(entity.hasTag("amw:change_attributes")){
                    entity.removeTag("amw:change_attributes");
                    for(let data of attributes){
                        entity.getComponent(data).resetToDefaultValue();
                    }
                }
                if(name != undefined){
                    console.warn("Removing magic target...");
                    entity.removeTag(name);
                }
            }
        }
        system.runTimeout(() => {
            // console.warn("Removing magic entity...");
            system.clearRun(startId);
        }, (start_tick == system.currentTick) ? 0 : 20);
    }
});

for(let playerData of world.getPlayers()){
    playerData.inputPermissions.movementEnabled = true;
    playerData.inputPermissions.cameraEnabled = true;
}

// let pl;
// world.afterEvents.entitySpawn.subscribe(s=>{
//     if(s.entity.typeId != "amw:entity_target") return;
//     let loc = pl.getHeadLocation();
//     let view = pl.getViewDirection();
//     let dist = 4;
//     let block = pl.dimension.getBlockFromRay(loc, view, {maxDistance: 4, includePassableBlocks: false});
//     if(block != undefined){
//         dist = Vector.distance(loc, Vector.add(block.block.location, block.faceLocation));
//     }
//     console.warn(dist)
//     s.entity.setProperty("amw:camera_distance", parseInt(Math.min(dist * 10, 40)));

//     dist = 4;
//     let block_inv = pl.dimension.getBlockFromRay(loc, {x: -view.x, y: -view.y, z: -view.z}, {maxDistance: 4, includePassableBlocks: false});
//     if(block_inv != undefined){
//         dist = Vector.distance(loc, Vector.add(block_inv.block.location, block_inv.faceLocation));
//     }
//     console.warn(dist)
//     s.entity.setProperty("amw:camera_distance_invert", parseInt(Math.min(dist * 10, 40)));
// })

system.runInterval(() => {
    for(let playerData of world.getPlayers()){
        // pl = playerData;
        let tick = system.currentTick;
        if(!register_player_id.includes(playerData.id)){
            for(let id = 0; id < 50; id++){
                try {
                    playerData.runCommandAsync("fog @s remove amw:volume_" + id);
                }catch(error){}
            }
            register_player_id.push(playerData.id);
        }

        if(player_custom_effect[playerData.id] == undefined){
            player_custom_effect[playerData.id] = {
                is_update: false,
                common_total: playerData.getEffects().length,
                effect: {}
            }
        }else{
            let total_effect = playerData.getEffects().length;
            if(player_custom_effect[playerData.id].common_total != total_effect || player_custom_effect[playerData.id].is_update){
                player_custom_effect[playerData.id].is_update = false;
                player_custom_effect[playerData.id].common_total = total_effect;
                let total_effect_name = "";
                let effects_names = Object.keys(player_custom_effect[playerData.id].effect);
                for(let effect_name of effects_names){
                    let effect = player_custom_effect[playerData.id].effect[effect_name];
                    let duration = effect - tick;
                    if(duration > 0){
                        total_effect_name += effect_name + (duration < 200 ? "_low " : " ");
                    }
                    console.warn(duration)
                }
                for(let i = 0; i < total_effect; i++){
                    total_effect_name += "blank_" + i + " ";
                }
                playerData.runCommand("scriptevent ui_load:custom_effect_update " + total_effect_name + "custom_effect_update")
                console.warn("scriptevent ui_load:custom_effect_update " + total_effect_name + "custom_effect_update")
            }
        }
        for(let entity of playerData.dimension.getEntities({ type: "amw:soul_fragment", location: playerData.getHeadLocation(), maxDistance: 2})){
            soul_objective.addScore(playerData, parseInt(Math.random() * 10));
            entity.remove();
            playerData.playSound("particle.soul_escape", { pitch: 2, volume: 1 });
            playerData.playSound("bloom.sculk_catalyst");
            playerData.playSound("random.orb", { pitch: 4, volume: 0.9 });
        }
    };
    for(let dimension of dimension_list){
        for(let despawn_data of despawn_location[dimension.id]){
            try {
                dimension.spawnParticle("magic:despawn_effect", despawn_data.location, particleMap);
                if(despawn_data.is_ground) dimension.spawnParticle("magic:despawn_smoke", despawn_data.location, particleMap);
            }catch(err){}
            despawn_location[dimension.id].pop(despawn_data);
        }

        for(let entity of dimension.getEntities({ families: [ "magic" ] })){
            if(entity.getDynamicProperty("test")) console.warn('aaaaaaaaa')
            if(entity.typeId == "amw:ice_shard"){
            /*    let vel = entity.getVelocity();
                if(entity.hasTag("move")){
                    let loc = entity.location;
                    if(!entity.dimension.getBlock( { x: loc.x, y: loc.y - 1, z: loc.z} ).isAir()) entity.triggerEvent("despawn");
                }else{
                    if(vel.x != 0 || vel.y != 0 || vel.z != 0) entity.addTag("move");
                }*/
            }else if(entity.typeId == "amw:astral_mount"){
                entity.addEffect("slow_falling", 10, { amplifier: 10, showParticles: false });
            }else if(entity.typeId == "amw:magic_light_source"){
                let location = entity.location;
                let dimension = entity.dimension;
                dimension.spawnParticle("magic:light_source", location, particleMap);
                let block = dimension.getBlock(location);
                if(block != undefined && block.typeId == "minecraft:air"){
                    entity.runCommand("setblock ~~~ amw:light_source_block");
                }
            }
        }
    }
});

world.afterEvents.dataDrivenEntityTrigger.subscribe(s=>{
    if(Vector.getLength(s.entity.getVelocity()) == 0){
        let entity = s.entity.dimension.getEntities({location: s.entity.location, closest: 1, excludeTypes: [ "amw:magic_cast_placeholder" ]})[0];
        s.entity.remove();
        entity.runCommandAsync('scriptevent amw:cast ' + s.eventId);
        return;
    };
    let view = s.entity.getVelocity();
    let x = Math.atan2(-view.y, Math.sqrt(view.x * view.x + view.z * view.z))* 180 / Math.PI;
    let y = -Math.atan2(-view.x, -view.z)* 180 / Math.PI + 180;
    if(y > 180) y = -(360 - y);
    let rotation = { x: Math.round(x / 90) * 90, y: y };
    console.warn(JSON.stringify(rotation) + "  " + s.eventId)
    let location = s.entity.location;
    system.runTimeout(()=>{
        s.entity.runCommand('scriptevent amw:cast ' + s.eventId);
    }, 2);
    console.warn(JSON.stringify(s.entity.getVelocity()))
    let run_id = system.runInterval(()=>{
        if(!s.entity.isValid()){
            system.clearRun(run_id);
            return;
        }
        s.entity.teleport(location, {rotation: rotation});
    })
    system.runTimeout(()=>{
        s.clearRun(run_id);
        if(s.entity.isValid()) s.entity.remove();
    }, 1200)
}, { entityTypes: [ "amw:magic_cast_placeholder" ]})

world.afterEvents.entityHurt.subscribe(s=>{
    if(s.damageSource.cause == "lightning" && Math.random() < 0.4){
        let charged = s.hurtEntity.dimension.spawnEntity("amw:charged_skeleton", s.hurtEntity.location);
        charged.setRotation(s.hurtEntity.getRotation());
        s.hurtEntity.remove();
    }
}, { entityTypes: [
    "minecraft:skeleton",
    "minecraft:bogged",
    "minecraft:stray"
]})

world.afterEvents.itemUse.subscribe(s=>{
    if(Math.random() <= 0.2 && s.itemStack.typeId == "minecraft:glass_bottle"){
        let entity = s.source.getEntitiesFromViewDirection({ maxDistance: 6, families: [ "monster" ] });
        if(entity.length > 0){
            entity = entity[0].entity;
            if(entity.hasComponent("minecraft:is_charged")){
                let mainhand = s.source.getComponent("minecraft:equippable").getEquipmentSlot("Mainhand");

                if(mainhand.amount > 1){
                    mainhand.amount = mainhand.amount - 1;
                }else{
                    mainhand.setItem();
                }
                let container = s.source.getComponent("minecraft:inventory").container;
                if(container.emptySlotsCount > 0){
                    container.addItem(InfusedElectroBottle);
                }else{
                    s.source.dimension.spawnItem(InfusedElectroBottle, s.source.location);
                }
            }
        }
    }
})

world.afterEvents.entityDie.subscribe(s=>{
    let dimension = s.deadEntity.dimension;
    for(let item of Object.keys(EntityCustomDrop[s.deadEntity.typeId])){
        let loot = EntityCustomDrop[s.deadEntity.typeId][item];
        if(Math.random() <= loot.rarity){
            let quantity = parseInt(((loot.max_quantity - loot.min_quantity) * (Math.random() + 0.01)) + loot.min_quantity);
            if(quantity > 0) dimension.spawnItem(new ItemStack(item, quantity), s.deadEntity.location);
        }
    }
}, {
    entityTypes: Object.keys(EntityCustomDrop)
})