import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import * as SpellDB from "./spell_book_database";
import { magic_data } from "./magic_list";

export function setFastSwap(source, spellSlot){
    let table = new ActionFormData();
    table.title('fast_swap_scroll.menu');

    for(let spell of SpellDB.getSpellData(spellSlot).spell){
        table.button(magic_data[spell].name, magic_data[spell].path)
    }
    
	table.body("menu.invisible");
    table.show(source).then(e=>{
        if(e.selection != undefined){
            SpellDB.setSpellSlot(spellSlot, e.selection);
            source.playSound("item.book.page_turn", { pitch: 1.1, volume: 1 });
        }
    })
}