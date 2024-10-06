import { getPredefineAttributes } from "./item_list";

const StartLore = "§r§9+";

const AttributesName = {
    soul_capacity: "Soul Capacity",
    fire_magic: "Fire",
    water_magic: "Water",
    nature_magic: "Nature", 
    ice_magic: "Ice",
    void_magic: "Void",
    dark_magic: "Dark",
    light_magic: "Light",
    wind_magic: "Wind",
    thunder_magic: "Thunder"
}

function setAttributeLores(container, data){
    let lores = container.getLore();
    let replacement_lores = [];

    let flag = [];

    for(let type of Object.keys(data)){
        if(type == "attribute_point") continue;

        if(data[type] > 0){
            replacement_lores.push(StartLore + data[type] + " " + AttributesName[type] + ((type != "soul_capacity") ? " Magic" : ""));
            flag.push(AttributesName[type]);
        }
    }
    if(flag.length == 0) return;

    for(let lore of lores){
        if(lore.startsWith(StartLore)){
            if(lore.endsWith(" Magic")){
                let is_not_attributes = true;
                let lore_length = lore.length - 6;
                for(let name of flag){
                    if(lore.endsWith(name, lore_length)){
                        is_not_attributes = false;
                        break;
                    }
                }
                if(is_not_attributes) replacement_lores.push(lore);
            }else if(lore.endsWith(" Soul Capacity")){
                if(lore.length > 23){
                    replacement_lores.push(lore)
                }
            }
        }else{
            replacement_lores.push(lore)
        }
    }

    container.setLore(replacement_lores);
}

function hasItem(container){
    if(container == undefined){
        return false;
    }else{
        try{
            return container.hasItem();
        }catch(error){}
    }
    return true;
}

export function setupMagicAttribute(container){
    if(container.getDynamicProperty("magic_property") != undefined) return;
    let data = {
        attribute_point: 0,
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
	}

    container.setDynamicProperty("magic_property", JSON.stringify(data));
    setAttributeLores(container, getMagicAttributeData(container, false));
};

export function getMagicAttributeData(container, only_item = true){
    let data = !hasItem(container) ? undefined : container.getDynamicProperty("magic_property");
    let is_first = false;
    if(data == undefined){
        is_first = (container.hasItem());
        data = {
            attribute_point: 0,
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
        }
    }else{
        data = JSON.parse(data);
    }

    if(hasItem(container) && !only_item && getPredefineAttributes()[container.typeId]){
        let predefiene = getPredefineAttributes()[container.typeId];
        for(let attribute of Object.keys(predefiene)){
            data[attribute] += predefiene[attribute];
        }
    }

    if(is_first){
        if(only_item){
            let temp_data = data;
            if(getPredefineAttributes()[container.typeId]){
                let predefiene = getPredefineAttributes()[container.typeId];
                for(let attribute of Object.keys(predefiene)){
                    temp_data[attribute] += predefiene[attribute];
                }
            }
            setAttributeLores(container, temp_data);
        }else{
            setAttributeLores(container, data);
        }
    }
    return data;
};

export function addAttributePoint(container, value = 1){
    let data = container.getDynamicProperty("magic_property");
    if(data == undefined){
        data = {
            attribute_point: 0,
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
    }else{
        data = JSON.parse(data);
    }
    data.attribute_point += value;
    container.setDynamicProperty("magic_property", JSON.stringify(data));
};

export function addMagicAttribute(container, attribute_name, value = 1){
    let data = container.getDynamicProperty("magic_property");
    if(data == undefined){
        data = {
            attribute_point: 0,
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
    }else{
        data = JSON.parse(data);
    }

    data[attribute_name] += value;
    
    container.setDynamicProperty("magic_property", JSON.stringify(data));
    setAttributeLores(container, getMagicAttributeData(container, false));
};