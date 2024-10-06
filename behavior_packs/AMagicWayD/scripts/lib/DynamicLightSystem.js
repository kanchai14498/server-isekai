import { world, system } from "@minecraft/server";

let SendData = {
    item: {},
    entity: {},
    entity_event: {}
}

let send_tick;
let dimension = world.getDimension("minecraft:overworld");

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

system.runInterval(()=>{
    if(send_tick != undefined){
        if(send_tick <= system.currentTick){
            let id = generateUUID();
            for(let split_data of JSON.stringify(SendData).match(/.{1,255}/g)){
                dimension.runCommand("scriptevent load_dynamic_light:" + id + " " + split_data);
            }

            send_tick = undefined;
        }
    }
})

export class DynamicLightLoader{
    static addItemLight(item, light_level = 16){
        SendData.item[item] = light_level;
        send_tick = system.currentTick + 1;
    }

    static addEntityLight(entity, light_level = 16){
        SendData.entity[entity] = light_level;
        send_tick = system.currentTick + 1;
    }

    static addEntityEventLight(event, light_level = 16, duration = 100){
        SendData.entity_event[event] = {
            light_light: light_level,
            duration: duration
        };
        send_tick = system.currentTick + 1;
    }
}