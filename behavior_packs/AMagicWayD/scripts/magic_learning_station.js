import { ActionFormData } from "@minecraft/server-ui";
import { system, world, ItemStack } from "@minecraft/server";
import { magic_data } from "./magic_list";
import * as ItemData from "./item_list";
import { Vector } from "./Vector3";
import { getSpellRecipes } from "./spell_recipes";

const GradeToInt = {
	basic: 0,
	intermediate: 1,
	advance: 2,
	expert: 3,
	master: 4
}

const ElementItem = {
	"amw:nature_magic_essence": "nature",
	"amw:fire_magic_essence": "fire", 
	"amw:void_magic_essence": "void", 
    "amw:dark_magic_essence": "dark",
    "amw:water_magic_essence": "water",
    "amw:thunder_magic_essence": "thunder",
    "amw:wind_magic_essence": "wind",
    "amw:light_magic_essence": "light",
    "amw:ice_magic_essence": "ice",
    "minecraft:paper": "paper"
}

const ElementToItem = {
	nature: "amw:nature_magic_essence",
    fire: "amw:fire_magic_essence", 
    void: "amw:void_magic_essence", 
    dark: "amw:dark_magic_essence",
    water: "amw:water_magic_essence",
    thunder: "amw:thunder_magic_essence",
    wind: "amw:wind_magic_essence",
    light: "amw:light_magic_essence",
    ice: "amw:ice_magic_essence"
}

const EssenseItemId = Object.keys(ElementItem);
EssenseItemId.push("minecraft:paper");

const Dimensions = [
    world.getDimension("minecraft:overworld"),
    world.getDimension("minecraft:nether"),
    world.getDimension("minecraft:the_end")
]

const grades = [
	"Unlearned",
	"Basic",
	"Intermediate",
	"Advance",
	"Expert",
	"Master"
]

var SortedSpellList = {};
var attributes = [];
var ScrollItem = {};

for(let list of Object.keys(magic_data)){
	let magic = magic_data[list];
	if(magic.attribute == undefined) continue;

	for(let attribute of magic.attribute){
		if(SortedSpellList[attribute] == undefined){
			SortedSpellList[attribute] = [];
			attributes.push(attribute);
		}

		SortedSpellList[attribute].push(list);
	}
}

for(let list of attributes){
	SortedSpellList[list].sort((a, b) => {
		let from = GradeToInt[magic_data[a].grade];
		let to = GradeToInt[magic_data[b].grade];
		return from - to;
	});
}

for(let scroll of Object.keys(ItemData.getScrolls())){
	ScrollItem[ItemData.getScrolls()[scroll]] = scroll;
}

const elements_type = [
	[ "fire_type", "Fire Type", "fire", "fire_mastering" ],
	[ "dark_type", "Dark Type", "dark", "dark_mastering" ],
	[ "nature_type", "Nature Type", "nature", "nature_mastering" ],
	[ "wind_type", "Wind Type", "wind", "wind_mastering" ],
	[ "void_type", "Void Type", "void", "void_mastering" ],
	[ "ice_type", "Ice Type", "ice", "ice_mastering" ],
	[ "water_type", "Water Type", "water", "water_mastering" ],
	[ "thunder_type", "Thunder Type", "thunder", "thunder_mastering" ],
	[ "light_type", "Light Type", "light", "light_mastering" ]
];

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function scrollCraft(source, selected, book, list_select = -1){
	let recipes = getSpellRecipes();
	let table = new ActionFormData();
    table.title('magic_learning_station.menu');
	let visibility = "menu.invisible";
	let spell_mastering = book;

	let element_id = 0;
	for(let elements of elements_type){
		if(element_id == selected){
			table.button(elements[0] + " locked", elements[1]);
		}else{
			table.button(elements[0], elements[1]);
		}
		element_id++;
	}

	let locked_id = ["", ""];
	let spell_id = 0;
	for(let spell of SortedSpellList[elements_type[selected][2]]){
		let magic = magic_data[spell];
		let name = magic.name;
		if(list_select != -1 && spell_id == list_select){
			locked_id = ["§e", ""]
		}else{
			locked_id = ["", ""]
		}
		if(GradeToInt[magic.grade] > spell_mastering){
			locked_id = ["§c", "_locked"]
			name = "§k" + magic.name + "§k";
		}
		table.button(locked_id[0] + "§l" + name + "\n§r" + locked_id[0] + "[ " + magic.grade.toUpperCase() + " ] amw:spell" + locked_id[1], (GradeToInt[magic.grade] - 1 <= spell_mastering) ? magic.path : "textures/ui/locked_spell");
		spell_id++;
	}
	let spell_recipes;
	let can_craft = false;
	if(list_select != -1){
		
		//table.button("description_scroll", "[  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ][  Work In Progress ]");
		let spell = magic_data[SortedSpellList[elements_type[selected][2]][list_select]];
		let desc = "";
		spell_recipes = recipes[SortedSpellList[elements_type[selected][2]][list_select]];
		let container = source.getComponent("minecraft:inventory").container;

		let items = {};
		if(source.getGameMode() == "creative"){
			items = {
				nature: 99,
				fire: 99, 
				void: 99, 
				dark: 99,
				water: 99,
				thunder: 99,
				wind: 99,
				light: 99,
				ice: 99,
				paper: 99
			}
		}else{
			for(let i = 0; i < 36; i++){
				let item = container.getItem(i);
				if(item != undefined && ElementItem[item.typeId] != undefined){
					if(items[ElementItem[item.typeId]]){
						items[ElementItem[item.typeId]] += item.amount;
					}else{
						items[ElementItem[item.typeId]] = item.amount;
					}
				}
			}	
		}
		
		can_craft = (items.paper >= spell_recipes.paper);

		let recipes_list = "Recipes: \n";
		recipes_list += ((items.paper < spell_recipes.paper || items.paper == undefined) ? "§c" : "§r") + spell_recipes.paper + "x Paper\n";
		for(let recipes_element of spell_recipes.elements){
			recipes_list += ((items[recipes_element] < spell_recipes.essence || items[recipes_element] == undefined) ? "§c" : "§r") + spell_recipes.essence + "x " + capitalize(recipes_element) + " Magic Essence\n";
			if(items[recipes_element] < spell_recipes.essence || items[recipes_element] == undefined) can_craft = false;
		}

		if(can_craft) table.button("craft");
		table.button("scroll_recipe", recipes_list);
		desc += "[ " + spell.name + " ]\n";
		desc += "Cast Duration: " + (spell.cast_duration / 20).toFixed(1) + "s\n";
		desc += "Soul Cost: " + spell.soul_cost + "\n\n";
		desc += "Attributes:\n";

		let gap = false;
		for(let attribute of spell.attribute){
			if(gap) desc += ", ";
			desc += capitalize(attribute);
			if(gap == false) gap = true;
		}
		desc += "\nType: " + capitalize(spell.type) + "\n\n";
		desc += "Description:\n";
		desc += spell.description;
		table.button("description_scroll", desc + "\n\n");
	}

	table.body(visibility + " scroll_craft");
	table.show(source).then( r => {
		if(r.selection < spell_id + element_id){
			if(r.selection <= 8){
				scrollCraft(source, r.selection, book);
			}else if(r.selection > 8){
				if(r.selection - 9 == list_select){
					scrollCraft(source, selected, book);
				}else{
					scrollCraft(source, selected, book, r.selection - 9);
				}
			}
		}else{
			let selection = r.selection - spell_id - element_id;
			if(selection == 0 && can_craft){
				let item_name = SortedSpellList[elements_type[selected][2]][list_select];
				let item = new ItemStack(ScrollItem[item_name]);
				let container = source.getComponent("minecraft:inventory").container;
				if(container.emptySlotsCount > 0){
					container.addItem(item);
				}else{
					source.dimension.spawnItem(item, source.location);
				}
				if(source.getGameMode() != "creative"){
					let decrease_item = {};
					for(let i = 0; i < 36; i++){
						let item = container.getSlot(i);
						if(item.hasItem() && ElementItem[item.typeId] != undefined){
							if(spell_recipes.elements.includes(ElementItem[item.typeId]) || item.typeId == "minecraft:paper"){
								if(decrease_item[item.typeId] == undefined) decrease_item[item.typeId] = (item.typeId == "minecraft:paper") ? spell_recipes.paper : spell_recipes.essence;
								if(decrease_item[item.typeId] <= 0) continue;
								let amount = item.amount;
								let id = item.typeId;
								if(item.amount <= decrease_item[item.typeId]){
									item.setItem();
								}else{
									item.amount -= decrease_item[item.typeId];
								}
								decrease_item[id] -= amount;
							}
						}
					}
				}
				
				scrollCraft(source, selected, book);
			}
		}
	});
}

// system.afterEvents.scriptEventReceive.subscribe( s => {
// 	if(s.id == "amw:use_magic_learning_station"){
// 		// learningStationMenu(s.sourceEntity);
// 		let block = s.sourceEntity.getBlockFromViewDirection().block;

// 		let dimension = s.sourceEntity.dimension;
// 		let volume_scan = new BlockVolume(Vector.subtract(block.location, {x: 2, y: 1, z: 2}), Vector.add(block.location, {x: 2, y: 2, z: 2}));

// 		scrollCraft(s.sourceEntity, 0, (s.sourceEntity.getGameMode() == "creative") ? 4: Math.min(4, (dimension.getBlocks(volume_scan, {includeTypes: [ "minecraft:bookshelf" ]}).getCapacity() / 25) * 4));
// 	}
// }, { namespaces: [ "amw"] });

export function openMagicLearningStation(source, block){
	let dimension = source.dimension;
	// let volume_scan = new BlockVolume(Vector.subtract(block.location, {x: 2, y: 1, z: 2}), Vector.add(block.location, {x: 2, y: 2, z: 2}));

	// scrollCraft(source, 0, (source.getGameMode() == "creative") ? 4: Math.min(4, (dimension.getBlocks(volume_scan, {includeTypes: [ "minecraft:bookshelf" ]}).getCapacity() / 25) * 4));

	let book = 0;
	if(source.getGameMode() == "creative"){
		book = 4;
	}else{
		for(let x = -2; x <= 2; x++){
			if(book >= 25) break;
			for(let y = -2; y <= 2; y++){
				if(book >= 25) break;
				for(let z = -2; z <= 2; z++){
					if(book >= 25) break;
					let scan = dimension.getBlock(Vector.add(block.location, { x: x, y: y, z: z }));
					if(scan.typeId == "minecraft:bookshelf") book++;
				}
			}
		}
		book = Math.min(4, (book / 25) * 4);
	}

	scrollCraft(source, 0, book);
}


system.runInterval(()=>{
    for(let dimension of Dimensions){
        for(let entity of dimension.getEntities({ type: "amw:floating_magic_book" })){
            let location = entity.location;
			try{
                if(dimension.getBlock(location).typeId != "amw:magic_learning_station"){
                    entity.remove();
                    continue;
                }
            }catch(error){
                continue;
            }
		}
	}
}, 2);