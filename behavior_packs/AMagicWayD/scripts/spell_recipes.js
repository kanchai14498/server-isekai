import { magic_data } from "./magic_list";

const Elements = [
    "nature",
    "fire", 
    "void", 
    "dark",
    "water",
    "thunder",
    "wind",
    "light",
    "ice"
];

const GradeToInt = {
	basic: 0,
	intermediate: 1,
	advance: 2,
	expert: 3,
	master: 4
}

var spell_recipes = {};

function updateSpellRecipes(){
    let spell_id = Object.keys(magic_data);
    for(let spell_name of spell_id){
        if(spell_name == "none") continue;
        let spell = magic_data[spell_name];

        let paper = Math.ceil(spell.cast_duration / 10);
        let essence = ((spell.soul_cost + spell.cast_duration + GradeToInt[spell.grade] * 100) / 30);
        let used_elements = [];
        let total_elements = 0;
        for(let attribute of spell.attribute){
            if(Elements.includes(attribute)){
                used_elements.push(attribute);
                total_elements++;
            }
        }
        let data = {
            paper: paper,
            elements: used_elements,
            essence: Math.ceil(essence / total_elements)
        }
        spell_recipes[spell_name] = data;
    }
}

updateSpellRecipes();

export function getSpellRecipes(){
    return spell_recipes;
}