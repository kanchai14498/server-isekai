import * as MagicList from "./magic_list";
import * as ItemData from "./item_list";

var SpellBookCompatibility = {};

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

function checkCompatibility(){
    let magic_list = Object.keys(MagicList.magic_data);
    let spell_book_list = Object.keys(ItemData.getSpellBooks());

    for(let book_name of spell_book_list){
        let spell_book_data = ItemData.getSpellBooks()[book_name];
        SpellBookCompatibility[book_name] = [];

        for(let magic_name of magic_list){
            if(magic_name == "none") continue;
            let scroll_data = MagicList.magic_data[magic_name];
            let accepted = false;

            for(let attributes of scroll_data.attribute){
                if(spell_book_data.compatible_attributes.includes(attributes)){
                    accepted = true;
                    break;
                }
            }

            if(accepted) for(let attributes of scroll_data.attribute){
                if(spell_book_data.incompatible_attributes.includes(attributes)){
                    accepted = false;
                    break;
                }
            }
            
            if(accepted && !spell_book_data.compatible_types.includes(scroll_data.type)){
                accepted = false;
            }

            let grade = GradeToInt[scroll_data.grade];

            if(accepted && (spell_book_data.grade[0] > grade || spell_book_data.grade[1] < grade)){
                accepted = false;
            }
            if(accepted) SpellBookCompatibility[book_name].push(magic_name);
        }

    }

}

checkCompatibility();

const MagicSlotName = "\n§r§9Magic Spells:";

function setMagicLores(container, data){
    let lores = container.getLore();

    let previous_lores = container.getDynamicProperty("previous_spell_lores");
    if(previous_lores){
        previous_lores = JSON.parse(previous_lores);
    }else{
        previous_lores = [];
    }

    let added_lores = MagicSlotName;
    let added_length = 19;
    let current_lore = [];

    let replacement_lores = [];
    let scan_index = 0;
    for(let lore of lores){
        if(previous_lores.length > 0 && previous_lores[scan_index] == lore){
            scan_index++;
        }else{
            replacement_lores.push(lore);
        }
    }

    let contained_spell = [ ...data.spell ];
    contained_spell = contained_spell.slice(0, 9);

    for(let spell of contained_spell){
        if(added_length + 7 + MagicList.magic_data[spell].name.length > 50){
            replacement_lores.push(added_lores);
            current_lore.push(added_lores);
            
            added_lores = "§r§7 " + MagicList.magic_data[spell].name;
            added_length = 5 + MagicList.magic_data[spell].name.length;
        }else{
            added_lores += "\n§r§7 " + MagicList.magic_data[spell].name;
            added_length += 7 + MagicList.magic_data[spell].name.length;
        }
    }

    if(added_length > 0){
        replacement_lores.push(added_lores);
        current_lore.push(added_lores);
    }

    container.setDynamicProperty("previous_spell_lores", JSON.stringify(current_lore));
    container.setLore(replacement_lores);
}

export function checkCompatibilitySpellBook(container, spells){
    if(SpellBookCompatibility[container.typeId] == undefined) return false;
    for(let spell of spells){
        if(spell == "none") continue;
        if(!SpellBookCompatibility[container.typeId].includes(spell)) return false;
    }

    return true;
};

export function setupSpellBook(container, id = undefined){
    if(container.getDynamicProperty("spell_property") != undefined) return;
    let data = {
        id: parseInt(Math.random() * 4096),
        slot_id: 0,
        locked_spell: [],
        spell: [
            "none"
        ]
    };

    if(ItemData.getPredefineSpellBooks()[container.typeId]){
        let defined_spell = ItemData.getPredefineSpellBooks()[container.typeId];
        data.spell = defined_spell.spell;
        data.spell.push("none");
        data.locked_spell = defined_spell.locked_spell;
    };
    container.setDynamicProperty("spell_property", JSON.stringify(data));

    setMagicLores(container, data);
    return data;
};

export function getSpellData(container){
    let data = container.getDynamicProperty("spell_property");
    if(data == undefined) return undefined;
    return JSON.parse(data);
};

export function addSpell(container, spell_name){
    let data = container.getDynamicProperty("spell_property");
    if(data == undefined){
        data = {
            id: parseInt(Math.random() * 4096),
            slot_id: 0,
            locked_spell: [],
            spell: []
        };

        if(ItemData.getPredefineSpellBooks()[container.typeId]){
            let defined_spell = ItemData.getPredefineSpellBooks()[container.typeId];
            data.spell = defined_spell.spell;
            data.spell.push("none");
            data.locked_spell = defined_spell.locked_spell;
        };
        
    }else{
        data = JSON.parse(data);
    }
    if(Array.isArray(spell_name)){
        for(let spell of spell_name){
            data.spell.push(spell);
        }
    }else{
        data.spell.push(spell_name);
    }

    setMagicLores(container, data);
    container.setDynamicProperty("spell_property", JSON.stringify(data));
};

export function replaceSpell(container, spell_replace, spell_target = "none"){
    let data = JSON.parse(container.getDynamicProperty("spell_property"));
    let param = true;
    if(data.spell.includes(spell_target)){
        data.spell[data.spell.indexOf(spell_target)] = spell_replace
    }else{
        console.warn("Cannot replace spell from " + spell_target +  " to " + spell_replace);
        param = false;
    }
    
    setMagicLores(container, data);
    container.setDynamicProperty("spell_property", JSON.stringify(data));
    return param;
};

export function removeSpell(container, value){
    let data = JSON.parse(container.getDynamicProperty("spell_property"));
    data.spell[value] = "none";
    
    setMagicLores(container, data);
    container.setDynamicProperty("spell_property", JSON.stringify(data));
};

export function setSpellSlot(container, spell_slot){
    let data = JSON.parse(container.getDynamicProperty("spell_property"));
    data.slot_id = spell_slot;

    container.setDynamicProperty("spell_property", JSON.stringify(data));
};