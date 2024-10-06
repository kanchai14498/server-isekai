import { world, system, ItemStack } from "@minecraft/server";
import { reinforcement } from "./magic_reinforcement_recipes";
import * as ItemData from "./item_list";
import * as SpellDB from "./spell_book_database";
import * as MagicAttributeDB from "./magic_attributes_database";

const Dimensions = [
    world.getDimension("minecraft:overworld"),
    world.getDimension("minecraft:nether"),
    world.getDimension("minecraft:the_end")
]

const grades = [
	"Basic",
	"Intermediate",
	"Advance",
	"Expert",
	"Master"
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

const GradeToInt = {
	basic: 0,
	intermediate: 1,
	advance: 2,
	expert: 3,
	master: 4
}

const SpellBookToItem = {};

for(let spell_book of Object.keys(ItemData.getSpellBooks())){
    if(spell_book == "minecraft:writable_book") continue;
    
    let spell_book_data = ItemData.getSpellBooks()[spell_book];

    let spell_book_desc = new ItemStack(spell_book);
    let name = "§r" + spell_book_data.name;
    for(let i = name.length; i < 50; i++){
        name += " ";
    }
    spell_book_desc.nameTag = name;

    let spell_book_lores = [ "                                                  " ];
    spell_book_lores.push("§rSpell: §7" + spell_book_data.max_spell + " Max Spells");
    spell_book_lores.push("§rCompatible Attributes: §7");

    let total_length = 4;
    let text_temp = "§r§7";
    let first_name = true;

    for(let text of spell_book_data.compatible_attributes){
        total_length += text.length + 2;
        if(first_name){
            total_length += text.length;
            text_temp += capitalize(text);
            first_name = false;
            total_length -= 2;
            continue;
        }

        if(total_length < 50){
            text_temp += ", " + capitalize(text);
        }else{
            spell_book_lores.push(text_temp + ",");
            total_length = text.length + 4;
            text_temp = "§r§7" + capitalize(text);
        }
    }
    spell_book_lores.push(text_temp);

    spell_book_lores.push("§rIncompatible Attributes: §7" + (spell_book_data.incompatible_attributes.length == 0 ? "-" : ""));
    
    if(spell_book_data.incompatible_attributes.length > 0){
        total_length = 4;
        text_temp = "§r§7";
        first_name = true;

        for(let text of spell_book_data.incompatible_attributes){
            total_length += text.length + 2;
            if(first_name){
                total_length += text.length;
                text_temp += capitalize(text);
                first_name = false;
                total_length -= 2;
                continue;
            }

            if(total_length < 50){
                text_temp += ", " + capitalize(text);
            }else{
                spell_book_lores.push(text_temp + ",");
                total_length = text.length + 4;
                text_temp = "§r§7" + capitalize(text);
            }
        }
        spell_book_lores.push(text_temp);
    }

    spell_book_lores.push("§rCompatible Types: §7");

    total_length = 4;
    text_temp = "§r§7";
    first_name = true;

    for(let text of spell_book_data.compatible_types){
        total_length += text.length + 2;
        if(first_name){
            total_length += text.length;
            text_temp += capitalize(text);
            first_name = false;
            total_length -= 2;
            continue;
        }

        if(total_length < 50){
            text_temp += ", " + capitalize(text);
        }else{
            spell_book_lores.push(text_temp + ",");
            total_length = text.length + 4;
            text_temp = "§r§7" + capitalize(text);
        }
    }
    spell_book_lores.push(text_temp);

    spell_book_lores.push("§rGrades: §7" + grades[spell_book_data.grade[0]] + " - " + grades[spell_book_data.grade[1]]);

    spell_book_desc.setLore(spell_book_lores);

    SpellBookToItem[spell_book] = spell_book_desc;
}
let item_replace_data = {};
let main_item_id = {};

let scroll_selected_id = {}
let lapis_count_id = {}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

system.runInterval(()=>{
    for(let dimension of Dimensions){
        for(let entity of dimension.getEntities({ type: "amw:magic_reinforcement_table" })){
            let location = entity.location;
            location.y -= 0.2;

            let container = entity.getComponent("minecraft:inventory").container;

            let spell_book = container.getSlot(0);
            let lapis_lazuli = container.getSlot(12);
            
            if(spell_book.getItem() != undefined && item_replace_data[spell_book.getDynamicProperty("replacement_book")] != undefined){
                let item_data = item_replace_data[spell_book.getDynamicProperty("replacement_book")];
                spell_book.nameTag = item_data.nameTag;
                spell_book.setLore(item_data.lore);
                
                for(let property of item_data.property_list){
                    spell_book.setDynamicProperty(property, item_data.property[property]);
                }
                delete item_replace_data[spell_book.getDynamicProperty("replacement_book")];
                spell_book.setDynamicProperty("replacement_book");
            }

            try{
                if(dimension.getBlock(location).typeId != "amw:magic_reinforcement_table"){
                    location.y += 0.2;

                    if(spell_book.getItem() != undefined) dimension.spawnItem(spell_book.getItem(), location);
                    if(lapis_lazuli.getItem() != undefined) dimension.spawnItem(lapis_lazuli.getItem(), location);
                    entity.remove();
                    continue;
                }
            }catch(error){
                continue;
            }
            let lapis_count = 0;
            if(lapis_lazuli.getItem() != undefined && lapis_lazuli.typeId == "minecraft:lapis_lazuli") lapis_count = lapis_lazuli.amount;

            if(lapis_count_id[entity.id] == undefined){
                lapis_count_id[entity.id] = lapis_count;
            }else{
                if(lapis_count != lapis_count_id[entity.id]){
                    entity.setDynamicProperty("reinforcement_property", false);
                    lapis_count_id[entity.id] = lapis_count;
                }
            }
            if(spell_book.getItem() != undefined){
                if(main_item_id[entity.id] == undefined){
                    main_item_id[entity.id] = spell_book.typeId;
                }else{
                    if(spell_book.typeId != main_item_id[entity.id]){
                        entity.setDynamicProperty("reinforcement_property", false);
                        main_item_id[entity.id] = spell_book.typeId;
                    }
                }

                let data = {
                    id: parseInt(Math.random() * 4096),
                    slot_id: 0,
                    attribute_point: 0,
                    spell: []
                };
                if(ItemData.getSpellBooks()[spell_book.typeId] != undefined){
                    let spell_book_data = ItemData.getSpellBooks()[spell_book.typeId];
                    data = undefined;
                    data = SpellDB.getSpellData(spell_book);
                    if(data == undefined){
                        SpellDB.setupSpellBook(spell_book);
                        data = SpellDB.getSpellData(spell_book);
                    }
                    if(scroll_selected_id[entity.id] == undefined){
                        scroll_selected_id[entity.id] = data.id;
                    }else{
                        if(data.id != scroll_selected_id[entity.id]){
                            entity.setDynamicProperty("reinforcement_property", false);
                            scroll_selected_id[entity.id] = data.id;
                        }
                    }
                    let total_spell = data.spell.length;
                    let used_spell = total_spell;
                    
                    for(let spell of data.spell){
                        if(spell == "none"){
                            used_spell--;
                        }
                    }

                    let spell_book_desc = new ItemStack("amw:empty_placeholder");
                    spell_book_desc.nameTag = "§r§e§l[ " + spell_book_data.name + " ]";

                    let spell_book_lores = [ " " ];
                    spell_book_lores.push("§rSpell: §7" + used_spell + " / " + total_spell + " Spells [" + spell_book_data.max_spell + " max]");
                    spell_book_lores.push("§rCompatible Attributes: §7");

                    let total_length = 4;
                    let text_temp = "§r§7";
                    let first_name = true;

                    for(let text of spell_book_data.compatible_attributes){
                        total_length += text.length + 2;
                        if(first_name){
                            total_length += text.length;
                            text_temp += capitalize(text);
                            first_name = false;
                            total_length -= 2;
                            continue;
                        }

                        if(total_length < 37){
                            text_temp += ", " + capitalize(text);
                        }else{
                            spell_book_lores.push(text_temp + ",");
                            total_length = text.length + 4;
                            text_temp = "§r§7" + capitalize(text);
                        }
                    }
                    spell_book_lores.push(text_temp);

                    spell_book_lores.push("§rIncompatible Attributes: §7" + (spell_book_data.incompatible_attributes.length == 0 ? "-" : ""));
                    
                    if(spell_book_data.incompatible_attributes.length > 0){
                        total_length = 4;
                        text_temp = "§r§7";
                        first_name = true;
        
                        for(let text of spell_book_data.incompatible_attributes){
                            total_length += text.length + 2;
                            if(first_name){
                                total_length += text.length;
                                text_temp += capitalize(text);
                                first_name = false;
                                total_length -= 2;
                                continue;
                            }
        
                            if(total_length < 37){
                                text_temp += ", " + capitalize(text);
                            }else{
                                spell_book_lores.push(text_temp + ",");
                                total_length = text.length + 4;
                                text_temp = "§r§7" + capitalize(text);
                            }
                        }
                        spell_book_lores.push(text_temp);
                    }

                    spell_book_lores.push("§rCompatible Types: §7");

                    total_length = 4;
                    text_temp = "§r§7";
                    first_name = true;

                    for(let text of spell_book_data.compatible_types){
                        total_length += text.length + 2;
                        if(first_name){
                            total_length += text.length;
                            text_temp += capitalize(text);
                            first_name = false;
                            total_length -= 2;
                            continue;
                        }

                        if(total_length < 37){
                            text_temp += ", " + capitalize(text);
                        }else{
                            spell_book_lores.push(text_temp + ",");
                            total_length = text.length + 4;
                            text_temp = "§r§7" + capitalize(text);
                        }
                    }
                    spell_book_lores.push(text_temp);

                    spell_book_lores.push("§rGrades: §7" + grades[spell_book_data.grade[0]] + " - " + grades[spell_book_data.grade[1]]);

                    spell_book_desc.setLore(spell_book_lores);
                    container.setItem(1, spell_book_desc);
                }
                let reinforcement_property = true;
                

                if(reinforcement[spell_book.typeId] != undefined){

                    let list = reinforcement[spell_book.typeId].list;
                    let max_list = list.length;

                    let unlisted_item = new ItemStack("amw:empty_placeholder");
                    unlisted_item.nameTag = "§r UNLISTED ";

                    for(let i = 0; i < 7; i++){
                        let item;
                        if(i >= max_list){
                            unlisted_item.nameTag = "§r UNLISTED ";
                            item = unlisted_item;
                            container.setItem(14 + i, item);
                        }else{
                            let recipes = reinforcement[spell_book.typeId].list[i];
                            let compatibility = SpellDB.checkCompatibilitySpellBook({typeId: recipes.to}, data.spell);
                            if(!compatibility){
                                item = SpellBookToItem[recipes.to].clone();
                                item.nameTag = "§r§cUnsupported Spell";
                                item.setLore([]);
                                container.setItem(14 + i, item);
                            }else{
                                if(lapis_count >= recipes.price){
                                    if(container.getItem(14 + i) == undefined){
                                        // reinforcement_property = false;
                                        if(lapis_count > recipes.price){
                                            lapis_lazuli.amount -= recipes.price;
                                        }else{
                                            lapis_lazuli.setItem();
                                        }
    
                                        let property_list = spell_book.getDynamicPropertyIds();
                                        item_replace_data[entity.id] = {
                                            lore: spell_book.getLore(),
                                            nameTag: spell_book.nameTag,
                                            property_list: property_list,
                                            property: {}
                                        }
                        
                                        for(let property of property_list){
                                            item_replace_data[entity.id].property[property] = spell_book.getDynamicProperty(property);
                                        }
    
                                        spell_book.setItem();
                                        break;
                                    }
    
                                    if(!entity.getDynamicProperty("reinforcement_property")){
                                        item = SpellBookToItem[recipes.to].clone();
                                        item.setDynamicProperty("replacement_book", entity.id);
                                        container.setItem(14 + i, item);
                                    }
                                }else{
                                    item = SpellBookToItem[recipes.to].clone();
                                    item.nameTag = "§r§cRequire " + recipes.price + " Lapis Lazuli";
                                    item.setLore([]);
                                    container.setItem(14 + i, item);
                                }
                            }
                        }
                    }
    
                }else{
                    let unlisted_item = new ItemStack("amw:empty_placeholder");
                    unlisted_item.nameTag = "§r UNLISTED ";
    
                    for(let i = 14; i <= 20; i++){
                        container.setItem(i, unlisted_item);
                    }
                }
                if(spell_book.getItem() == undefined) continue;

                let magic_attribute = MagicAttributeDB.getMagicAttributeData(spell_book, false);
                let item_magic_attribute = MagicAttributeDB.getMagicAttributeData(spell_book, true);

                let item = new ItemStack("amw:empty_placeholder");
                let attributes_placeholder = new ItemStack("amw:empty_placeholder");
                attributes_placeholder.nameTag = " ";
                let lores = [""];

                let point_left = Math.max(0, ItemData.getAttributePoint()[spell_book.typeId] - magic_attribute.attribute_point);

                let unable_add_attribute = (spell_book.maxAmount > 1);

                if(ItemData.getAttributePoint()[spell_book.typeId] != undefined){
                    attributes_placeholder.nameTag = "§r" + point_left + "pts";
                }else{
                    unable_add_attribute = true;
                }
                for(let i = 0; i < 10; i++){
                    let attribute = AttributeList[i];
                    let value = magic_attribute[attribute];
                    if(unable_add_attribute){
                        container.setItem(i + 2, item);
                        continue;
                    }

                    if((i == 0 && item_magic_attribute.soul_capacity >= 50) || (i > 0 && item_magic_attribute[attribute] >= 5)){
                        lores.push("§r§6   " + value.toString().padStart(2, ' ') + "    " + value.toString().padStart(2, ' '))
                        // item.nameTag = "§r§7[ " + current_value_text + " > §c" + current_value_text + " §7]";
                        // item.setLore([ "§r§cMax Level Reached!" ]);
                        container.setItem(i + 2, item);
                    }else{
                        lores.push("§r   " + value.toString().padStart(2, ' ') + "    " + ((lapis_count < 3 || point_left <= 0) ? "§c" : "§a") + (value + ((i == 0) ? 5 : 1)).toString().padStart(2, ' '))
                        // item.nameTag = "§r§7[ " + current_value_text + " > §a" + (value + ((i == 0) ? 5 : 1)).toString().padStart(2, ' ') + " §7]";
                        // item.setLore([ "§r§" + (lapis_count < 3 ? 'c' : 'a') + "Require 3 Lapis Lazuli" ]);
                        // container.setItem(i + 2, item);
                        if(lapis_count >= 3 && container.getItem(i + 2) == undefined){
                            reinforcement_property = false;
                            if(lapis_count > 3){
                                lapis_lazuli.amount -= 3;
                            }else{
                                lapis_lazuli.setItem();
                            }
                            spell_book.setItem();
                            break;
                        }
                        if(lapis_count < 3 || point_left <= 0){
                            container.setItem(i + 2, item);
                        }else{
                            if(!entity.getDynamicProperty("reinforcement_property")){
                                let spell_book_clone = spell_book.getItem();
                                MagicAttributeDB.addMagicAttribute(spell_book_clone, attribute, (i == 0) ? 5 : 1);
                                MagicAttributeDB.addAttributePoint(spell_book_clone);
                                container.setItem(i + 2, spell_book_clone);
                            }
                        }
                    }
                }
                attributes_placeholder.setLore(lores);

                container.setItem(13, attributes_placeholder);
                if(lapis_count < 3) reinforcement_property = false;
                entity.setDynamicProperty("reinforcement_property", reinforcement_property);
            }else{
                let item = new ItemStack("amw:empty_placeholder");
                item.nameTag = " ";
                container.setItem(1, item);

                item.nameTag = "§r UNLISTED ";
                for(let i = 14; i <= 20; i++){
                    container.setItem(i, item);
                }

                item.nameTag = " ";
                for(let i = 2; i <= 11; i++){
                    container.setItem(i, item);
                }
                container.setItem(13, item);

                entity.setDynamicProperty("reinforcement_property", false);
            }
        }
    }
});

system.runInterval(()=>{
    for(let playerData of world.getPlayers()){
        let container = playerData.getComponent("minecraft:inventory").container;
        let i = 0;
        let run = system.runInterval(()=>{
            try {
                let item = container.getSlot(i);
                if(item != undefined && item_replace_data[item.getDynamicProperty("replacement_book")] != undefined){
                    let item_data = item_replace_data[item.getDynamicProperty("replacement_book")];
                    item.nameTag = item_data.nameTag;
                    item.setLore(item_data.lore);
                    
                    for(let property of item_data.property_list){
                        item.setDynamicProperty(property, item_data.property[property]);
                    }
                    delete item_replace_data[item.getDynamicProperty("replacement_book")];
                    item.setDynamicProperty("replacement_book");
                }
                i++;
                if(i >= container.size) system.clearRun(run);
            }catch(error){
                system.clearRun(run);
            }
        })
    }
}, 9)