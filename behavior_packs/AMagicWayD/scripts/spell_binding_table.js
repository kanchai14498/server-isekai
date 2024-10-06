import { world, system, ItemStack } from "@minecraft/server";
import * as ItemData from "./item_list";
import * as SpellDB from "./spell_book_database";
import * as MagicList from "./magic_list";

let NameToItem = {};
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

const GradeToInt = {
	basic: 0,
	intermediate: 1,
	advance: 2,
	expert: 3,
	master: 4
}

const ScrollToItem = {};

for(let scroll of Object.keys(ItemData.getScrolls())){
    ScrollToItem[ItemData.getScrolls()[scroll]] = scroll;

    if(scroll == "amw:none_scroll") continue;
    let item = new ItemStack(scroll);
    let name = "§r§e§l[ " + MagicList.magic_data[ItemData.getScrolls()[scroll]].name + " ]";
    NameToItem[name] = item;
}

let scroll_selected_id = {}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
let placeholder_item = [
    "amw:empty_placeholder",
    "amw:scroll_placeholder"
]
world.afterEvents.entitySpawn.subscribe(s=>{
    if(s.entity.typeId == "minecraft:item"){
        let item = s.entity.getComponent("minecraft:item");
        if(item != undefined && placeholder_item.includes(item.itemStack.typeId)){
            s.entity.remove();
        }
    }
})

system.runInterval(()=>{
    for(let dimension of Dimensions){
        for(let entity of dimension.getEntities({ type: "amw:spell_binding_table" })){
            let location = entity.location;
            location.y -= 0.2;

            let container = entity.getComponent("minecraft:inventory").container;

            let spell_book = container.getSlot(0);
            let spell = container.getSlot(1);

            if(spell.getItem() != undefined && spell.typeId == "amw:scroll_placeholder"){
                if(NameToItem[spell.nameTag]) spell.setItem(NameToItem[spell.nameTag]);
            }

            try{
                if(dimension.getBlock(location).typeId != "amw:spell_binding_table"){
                    location.y += 0.2;

                    if(spell_book.getItem() != undefined) dimension.spawnItem(spell_book.getItem(), location);
                    if(spell.getItem() != undefined) dimension.spawnItem(spell.getItem(), location);
                    entity.remove();
                    continue;
                }
            }catch(error){
                continue;
            }

            if(spell_book.getItem() != undefined && ItemData.getSpellBooks()[spell_book.typeId] != undefined && spell_book.typeId != "minecraft:writable_book"){
                let spell_book_data = ItemData.getSpellBooks()[spell_book.typeId];
                let data = SpellDB.getSpellData(spell_book);
                if(data == undefined){
                    SpellDB.setupSpellBook(spell_book);
                    data = SpellDB.getSpellData(spell_book);
                }
                if(scroll_selected_id[entity.id] == undefined){
                    scroll_selected_id[entity.id] = data.id;
                }else{
                    if(data.id != scroll_selected_id[entity.id]){
                        entity.setDynamicProperty("spell_property", false);
                        scroll_selected_id[entity.id] = data.id;
                    }
                }
                let total_spell = data.spell.length;
                
                let spell_property = true;
                let item = new ItemStack("amw:scroll_placeholder");
                let locked = new ItemStack("amw:empty_placeholder");
                let icon = new ItemStack("amw:empty_placeholder");
                
                for(let i = 0; i < 9; i++){
                    if(i < total_spell){
                        let spell = MagicList.magic_data[data.spell[i]];
                        let is_locked = data.locked_spell.includes(i);
                        if(entity.getDynamicProperty("spell_property")){
                            if(container.getItem(i+2) == undefined && data.spell[i] != "none" && !is_locked){
                                SpellDB.removeSpell(spell_book, i);
            
                                item.nameTag = "§r§e§l[ None ]";
                                container.setItem(i+2, item);
                            }
                        }
                        
                        if(!entity.getDynamicProperty("spell_property") || data.spell[i] == "none" || is_locked){
        
                            let name = "§r§e§l[ " + spell.name + " ]";
                            item.nameTag = name;
                            icon.nameTag = " undefined ";

                            if(data.spell[i] != "none"){
                                let lores = [];

                                lores.push(" ");
                                lores.push("§rCast Duration: §7" + (spell.cast_duration / 20).toFixed(1) + "s");
                                lores.push("§rSoul Cost: §7" + (spell.soul_cost));
                                lores.push("                                             ");
    
                                let attributes_list = "";
                                let attributes_add = "";
                                let len = 0;
    
                                for(let attribute of spell.attribute){
                                    len += attribute.length;
    
                                    if(len < 20){
                                        attributes_list += capitalize(attribute) + ", ";
                                    }else{
                                        attributes_add += capitalize(attribute) + ", ";
                                    }
                                }
    
                                lores.push("§rAttributes: §7" + attributes_list);
                                if(attributes_add != "") lores.push("§r§7" + attributes_add);
                                lores.push("§rGrade: §7" + capitalize(spell.grade));
                                lores.push("§rType: §7" + capitalize(spell.type));
                                lores.push(" ");
                                if(is_locked) lores.push("§r§l§8LOCKED");

                                item.setLore(lores);
                            }
                            container.setItem(i+2, item);
                        }
                        
                        icon.nameTag = spell.path.replace("textures/ui/magic_list/", '');
                        container.setItem(i+12, icon);
                    }else{
                        let name = "§r §cLocked§c ";
                        locked.nameTag = name;
                        icon.nameTag = " locked undefined ";
                        container.setItem(i+2, locked);
                        container.setItem(i+12, icon);
                    }
                }

                let bind_parameter = {
                    spell: true,
                    compatible_attributes: false,
                    incompatible_attributes: true,
                    compatible_types: true,
                    grades: true
                }

                if(spell.getItem() != undefined){
                    if(spell.typeId == "amw:spell_paper"){
                        bind_parameter.compatible_attributes = true;
                        if(total_spell < spell_book_data.max_spell){
                            SpellDB.addSpell(spell_book, "none");
                            spell.setItem();
                            spell_property = false;
                        }else{
                            bind_parameter.spell = false;
                        }
                    }else if(ItemData.getScrolls()[spell.typeId] != undefined){
                        let scroll_data = MagicList.magic_data[ItemData.getScrolls()[spell.typeId]];

                        let is_accepted = true;

                        if(!data.spell.includes("none")){
                            bind_parameter.spell = false;
                            is_accepted = false;
                        }

                        for(let attributes of scroll_data.attribute){
                            if(!bind_parameter.compatible_attributes && spell_book_data.compatible_attributes.includes(attributes)){
                                bind_parameter.compatible_attributes = true;
                            }
                            if(bind_parameter.incompatible_attributes && spell_book_data.incompatible_attributes.includes(attributes)){
                                bind_parameter.incompatible_attributes = false;
                            }
                        }

                        if(!bind_parameter.compatible_attributes || !bind_parameter.incompatible_attributes){
                            is_accepted = false;
                        }

                        if(spell_book_data.compatible_types.length > 0 && !spell_book_data.compatible_types.includes(scroll_data.type)){
                            bind_parameter.compatible_types = false;
                            is_accepted = false;
                        }

                        let grade = GradeToInt[scroll_data.grade];

                        if(spell_book_data.grade[0] > grade || spell_book_data.grade[1] < grade){
                            bind_parameter.grades = false;
                            is_accepted = false;
                        }
                        if(is_accepted){
                            if(SpellDB.replaceSpell(spell_book, ItemData.getScrolls()[spell.typeId])){
                                spell.setItem();
                                spell_property = false;
                            }
                        }
                    }
                }else{
                    bind_parameter.compatible_attributes = true;
                }
                
                let used_spell = total_spell;

                for(let spell of data.spell){
                    if(spell == "none"){
                        used_spell--;
                    }
                }

                let spell_book_desc = new ItemStack("amw:scroll_placeholder");
                spell_book_desc.nameTag = "§r§e§l[ " + spell_book_data.name + " ]";

                let spell_book_lores = [ " " ];
                spell_book_lores.push((bind_parameter.spell ? "§r" : "§r§c") + "Spell: §7" + used_spell + " / " + total_spell + " Spells [" + spell_book_data.max_spell + " max]");
                spell_book_lores.push((bind_parameter.compatible_attributes ? "§r" : "§r§c") + "Compatible Attributes: §7");

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

                spell_book_lores.push((bind_parameter.incompatible_attributes ? "§r" : "§r§c") + "Incompatible Attributes: §7" + (spell_book_data.incompatible_attributes.length == 0 ? "-" : ""));
                
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

                spell_book_lores.push((bind_parameter.compatible_types ? "§r" : "§r§c") + "Compatible Types: §7");

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

                spell_book_lores.push((bind_parameter.grades ? "§r" : "§r§c") + "Grades: §7" + grades[spell_book_data.grade[0]] + " - " + grades[spell_book_data.grade[1]]);

                spell_book_desc.setLore(spell_book_lores);
                container.setItem(11, spell_book_desc);

                entity.setDynamicProperty("spell_property", spell_property);
            }else{
                let item = new ItemStack("amw:empty_placeholder");
                item.nameTag = "§rSpell Slot";
                for(let i = 2; i < 12; i++){
                    container.setItem(i, item);
                }
                item.nameTag = " ";
                container.setItem(11, item);
                item.nameTag = " undefined ";
                for(let i = 12; i < 21; i++){
                    container.setItem(i, item);
                }
                entity.setDynamicProperty("spell_property", false);
            }
        }
    }
})

system.runInterval(()=>{
    for(let playerData of world.getPlayers()){
        let container = playerData.getComponent("minecraft:inventory").container;
        let i = 0;
        let run = system.runInterval(()=>{
            try {
                let item = container.getItem(i);
                if(item != undefined && item.typeId == "amw:scroll_placeholder"){
                    if(NameToItem[item.nameTag]) container.setItem(i, NameToItem[item.nameTag]);
                }
                if(item != undefined && item.typeId == "amw:empty_placeholder"){
                    container.setItem(i);
                }
                i++;
                if(i >= container.size) system.clearRun(run);
            }catch(error){
                system.clearRun(run);
            }
        })
    }
}, 9)