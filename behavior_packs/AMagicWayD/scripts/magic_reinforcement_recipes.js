import * as ItemList from "./item_list";
import { ItemStack } from "@minecraft/server";
import { magic_data } from "./magic_list";

import * as SpellDB from "./spell_book_database";
export const reinforcement = {
    "minecraft:writable_book": {
        list: [
            {
                to: "amw:basic_spell_book",
                price: 3
            }
        ]
    },
    "amw:basic_spell_book": {
        list: [
            {
                to: "amw:book_of_witchcraft",
                price: 7
            },
            {
                to: "amw:summoner_tale",
                price: 5
            },
            {
                to: "amw:wizard_knowledge_volume_1",
                price: 12
            },
            {
                to: "amw:alchemist_journal_part_1",
                price: 10
            },
            {
                to: "amw:magic_research_book",
                price: 9
            }
        ]
    },

    "amw:book_of_witchcraft": {
        list: [
            {
                to: "amw:wicked_book",
                price: 15
            }
        ]
    },
    "amw:summoner_tale": {
        list: [
            {
                to: "amw:wicked_book",
                price: 16
            },
            {
                to: "amw:naturalist_guidance",
                price: 18
            }
        ]
    },
    "amw:wizard_knowledge_volume_1": {
        list: [
            {
                to: "amw:wizard_knowledge_volume_2",
                price: 20
            },
            {
                to: "amw:naturalist_guidance",
                price: 16
            },
            {
                to: "amw:wicked_book",
                price: 17
            }
        ]
    },
    "amw:alchemist_journal_part_1": {
        list: [
            {
                to: "amw:alchemist_journal_part_2",
                price: 20
            },
            {
                to: "amw:naturalist_guidance",
                price: 17
            }
        ]
    },
    "amw:magic_research_book": {
        list: [
            {
                to: "amw:grimore",
                price: 19
            },
            {
                to: "amw:book_of_dharma",
                price: 19
            }
        ]
    },

    "amw:alchemist_journal_part_2": {
        list: [
            {
                to: "amw:pyromancer_spell_book",
                price: 25
            },
            {
                to: "amw:sacred_book",
                price: 22
            },
            {
                to: "amw:zeus_archive_book",
                price: 26
            }
        ]
    },
    "amw:wicked_book": {
        list: [
            {
                to: "amw:sorcerer_spell_book",
                price: 29
            },
            {
                to: "amw:theory_of_darkness",
                price: 22
            }
        ]
    },
    "amw:naturalist_guidance": {
        list: [
            {
                to: "amw:pyromancer_spell_book",
                price: 27
            },
            {
                to: "amw:theory_of_darkness",
                price: 21
            }
        ]
    },
    "amw:wizard_knowledge_volume_2": {
        list: [
            {
                to: "amw:pyromancer_spell_book",
                price: 26
            },
            {
                to: "amw:sorcerer_spell_book",
                price: 24
            },
            {
                to: "amw:zeus_archive_book",
                price: 28
            }
        ]
    },
    "amw:book_of_dharma": {
        list: [
            {
                to: "amw:holy_book",
                price: 20
            }
        ]
    },
    "amw:grimore": {
        list: [
            {
                to: "amw:holy_book",
                price: 25
            },
            {
                to: "amw:sorcerer_spell_book",
                price: 21
            },
            {
                to: "amw:pyromancer_spell_book",
                price: 23
            },
            {
                to: "amw:sacred_book",
                price: 20
            }
        ]
    },

    "amw:sacred_book": {
        list: [
            {
                to: "amw:manuscript",
                price: 50
            }
        ]
    }
}