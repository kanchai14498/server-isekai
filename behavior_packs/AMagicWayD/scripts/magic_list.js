import * as magicFunction from "./magic_function";

/*
type: 
    creation,
    restoration,
    conjuration,
    destruction,
    transmutation,
    manipulation

elements:
    nature,
    fire, 
    void, 
    dark,
    water,
    thunder,
    wind,
    light,
    ice

grade:
0    basic,
1    intermediate,
2    advance,
3    expert,
4    master

ganti:
    alternate damage (cooldown)
*/


export const magic_data = {
    "none": {
        name: "None",
        path: "textures/ui/magic_list/none",
        cast_duration: 0,
        soul_cost: 0
    },
    // "item_skill": {
    //     name: "Item Skill",
    //     path: "textures/ui/magic_list/right_click",
    //     cast_duration: 0,
    //     soul_cost: 0
    // },
    "soul_devour": {
        name: "Soul Devour",
        path: "textures/ui/magic_list/soul_devour",
        attribute: [ "transmutation", "destruction", "dark" ],
        grade: "expert",
        type: "curse",
        cast_duration: 37,
        soul_cost: 72,
        function: magicFunction.createSourceDummy,
        modifier: {
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:area_circle",
                                offset: {
                                    x: 0,
                                    y: 0.01,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "data",
                                        data: {
                                            x: 10,
                                            y: 10,
                                            z: 30
                                        }
                                    },
                                    {
                                        name: "data_2",
                                        data: {
                                            x: 0,
                                            y: 0,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.33,
                                            green: 0.27,
                                            blue: 0.39,
                                            alpha: 0.5
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:area_circle_blend",
                                offset: {
                                    x: 0,
                                    y: 0.01,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "data",
                                        data: {
                                            x: 10,
                                            y: 10,
                                            z: 30
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.3,
                                            green: 0.24,
                                            blue: 0.37,
                                            alpha: 0.5
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 200,
                                delay: 2,
                                enable_cooldown: true,
                                can_cancel: false,
                                force_slot: false,
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 10,
                                        families: [ "mob" ],
                                        exclude_families: [ "undead", "inanimate" ],
                                        impact: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.damageToSource,
                                                        modifier: {
                                                            strength: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "dark_magic",
                                                                        multiply: 0.2,
                                                                        additive: 0.2
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.ramdomChanceSpell,
                                                        modifier: {
                                                            chance: 0.3,
                                                            spell: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    health: {
                                                                        operator: "<",
                                                                        value: 1
                                                                    },
                                                                    spell: {
                                                                        id: magicFunction.castMultipleSpell,
                                                                        modifier: {
                                                                            spell: [
                                                                                {
                                                                                    id: magicFunction.summonAtLocation,
                                                                                    modifier: {
                                                                                        type: "amw:soul_fragment"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    id: magicFunction.damageToSource,
                                                                                    modifier: {
                                                                                        strength: 2
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Create magic area that devour animals, when animals die it will turn into soul fragments."
    },
    "thunder_step": {
        name: "Thunder Step",
        path: "textures/ui/magic_list/thunder_step",
        attribute: [ "transmutation", "thunder" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 13,
        soul_cost: 32,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "thunder_step_effect",
                        restart_cluster: true,
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "thunder_magic",
                                    multiply: 20,
                                    additive: 205
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "thunder_magic",
                                    multiply: 20,
                                    additive: 200
                                }
                            ]
                        },
                        enable_cooldown: true,
                        force_slot: false,
                        spell: {
                            id: magicFunction.sourceTest,
                            modifier: {
                                single_scan: {
                                    cluster_name: "thunder_step_effect"
                                },
                                is_jumping: true,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.castAtActor,
                                                modifier: {
                                                    spell: {
                                                        id: magicFunction.sequenceCast,
                                                        modifier: {
                                                            spell: [
                                                                {
                                                                    id: magicFunction.addSingleScan,
                                                                    modifier: {
                                                                        cluster_name: "thunder_step_effect",
                                                                        duration: 10
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.summonAtLocation,
                                                                    modifier: {
                                                                        type: "amw:solid_entity<h1>",
                                                                        despawn: 25,
                                                                        offset: { x: 0, y: -1, z: 0},
                                                                        spell: {
                                                                            id: magicFunction.setScale,
                                                                            modifier: {
                                                                                scale: 0.15
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }  
                                                }
                                            },
                                            {
                                                id: magicFunction.castSpellAtView,
                                                modifier: {
                                                    range: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "thunder_magic",
                                                                multiply: 8,
                                                                additive: 24
                                                            }
                                                        ]
                                                    },
                                                    impact: {
                                                        id: magicFunction.sequenceCast,
                                                        modifier: {
                                                            spell: [
                                                                {
                                                                    id: magicFunction.teleport,
                                                                    modifier: {
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.createParticle,
                                                                    modifier: {
                                                                        particle: "magic:thunder_effect",
                                                                        offset: {
                                                                            x: 0,
                                                                            y: 1,
                                                                            z: 0
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Make caster able to teleport using thunder magic to view location ky jumping."
    },
    "blazing_trail": {
        name: "Blazing Trail",
        path: "textures/ui/magic_list/blazing_trail",
        attribute: [ "transmutation", "fire" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 20,
        soul_cost: 22,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "blazing_trail_toggle",
                        restart_cluster: true,
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "fire_magic",
                                    multiply: 40,
                                    additive: 400
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "fire_magic",
                                    multiply: 40,
                                    additive: 400
                                }
                            ]
                        },
                        enable_cooldown: true,
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            single_scan: {
                                                exclude: {
                                                    name: [ "blazing_trail_toggle" ]
                                                }
                                            },
                                            spell: {
                                                id: magicFunction.castMultipleSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.createParticle,
                                                            modifier: {
                                                                particle: "magic:blazing_trail"
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.setKnockbackToTarget,
                                                            modifier: {
                                                                target: "view",
                                                                strength: 0.8,
                                                                multiplier: { x: 1, y: 0.3, z: 1 }
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.distanceTarget,
                                                            modifier: {
                                                                distance: 3,
                                                                impact: {
                                                                    id: magicFunction.setFire,
                                                                    modifier: {
                                                                        strength: {
                                                                            magic_attributes: [
                                                                                {
                                                                                    magic_type: "fire_magic",
                                                                                    multiply: 1,
                                                                                    additive: 1
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            single_scan: {
                                                include: {
                                                    name: [ "blazing_trail_toggle" ]
                                                }
                                            },
                                            is_on_ground: false,
                                            spell: {
                                                id: magicFunction.castMultipleSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.setKnockbackToTarget,
                                                            modifier: {
                                                                target: "self",
                                                                strength: 0.0
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            is_pressing_jumping: true,
                                            single_scan: {
                                                exclude: {
                                                    name: [ "blazing_trail_toggle" ]
                                                }
                                            },
                                            spell: {
                                                id: magicFunction.castMultipleSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.removeSingleScan,
                                                            modifier: {
                                                                cluster_name: "blazing_trail_toggle"
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.skipCast,
                                                            modifier: {}
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            is_pressing_jumping: true,
                                            single_scan: {
                                                include: {
                                                    name: [ "blazing_trail_toggle" ]
                                                }
                                            },
                                            spell: {
                                                id: magicFunction.addSingleScan,
                                                modifier: {
                                                    cluster_name: "blazing_trail_toggle"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        description: "Make caster able to toggle fly by pressing jump. While it fly it will burns all entity nears caster."
    },
    "dirt_wall": {
        name: "Dirt Wall",
        path: "textures/ui/magic_list/dirt_wall",
        attribute: [ "creation", "nature" ],
        grade: "basic",
        type: "create",
        cast_duration: 10,
        soul_cost: 12,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 16,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.summonAtFloor,
                            modifier: {
                                type: "amw:dirt_wall",
                                despawn: 200,
                                copy_rotation: true,
                                spell: {
                                    id: magicFunction.castMultipleLocation,
                                    modifier: {
                                        formation: [
                                            [ "X", "X", "X", "X", "X" ]
                                        ],
                                        gap: 0.6,
                                        ancor: [ 3, 1 ],
                                        offset: { x: 0, y: 0, z: 0 },
                                        focus: "self",
                                        impact: {
                                            id: magicFunction.summonAtLocation,
                                            modifier: {
                                                type: "amw:solid_entity<h3>",
                                                despawn: 200,
                                                spell: {
                                                    id: magicFunction.setScale,
                                                    modifier: {
                                                        scale: 0.15
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.setCameraShake,
                            modifier: {
                                radius: 10,
                                duration: 20,
                                strength: 0.05
                            }
                        }
                    ]
                }
            }
        },
        description: "Create a dirt wall at target location."
    },
    "absolute_area": {
        name: "Absolute Area",
        path: "textures/ui/magic_list/absolute_area",
        attribute: [ "transmutation", "light" ],
        grade: "advance",
        type: "action",
        cast_duration: 28,
        soul_cost: 34,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "absolute_area",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 40,
                                    additive: 350
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.absoluteArea,
                    modifier: {
                        size: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 1,
                                    additive: 8
                                }
                            ]
                        },
                        height: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 0.5,
                                    additive: 6
                                }
                            ]
                        },
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 2,
                                    additive: 15
                                }
                            ]
                        }
                    }
                }
            ]
        },
        description: "Create an absolute area that can knockback entities outside the area."
    },
    "fire_obelisk": {
        name: "Fire Obelisk",
        path: "textures/ui/magic_list/fire_obelisk",
        attribute: [ "creation", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 16,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 32,
            impact: {
                id: magicFunction.summonAtFloor,
                modifier: {
                    type: "amw:fire_obelisk",
                    despawn:  {
                        magic_attributes: [
                            {
                                magic_type: "fire_magic",
                                multiply: 20,
                                additive: 200
                            }
                        ]
                    },
                    round_location: true,
                    spell: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.summonAtLocation,
                                    modifier: {
                                        type: "amw:solid_entity<h2>",
                                        despawn:  {
                                            magic_attributes: [
                                                {
                                                    magic_type: "fire_magic",
                                                    multiply: 20,
                                                    additive: 200
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.burstCast,
                                    modifier: {
                                        duration:  {
                                            magic_attributes: [
                                                {
                                                    magic_type: "fire_magic",
                                                    multiply: 20,
                                                    additive: 199
                                                }
                                            ]
                                        },
                                        delay: 20,
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.iterationCast,
                                                        modifier: {
                                                            iteration: 3,
                                                            spell: {
                                                                id: magicFunction.createParticle,
                                                                modifier: {
                                                                    particle: "magic:fire_spread_magic_effect",
                                                                    offset: { x: 0, y: 1.5, z: 0 }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 6,
                                                            impact: {
                                                                id: magicFunction.setFire,
                                                                modifier: {
                                                                    strength: {
                                                                        magic_attributes: [
                                                                            {
                                                                                magic_type: "fire_magic",
                                                                                multiply: 1,
                                                                                additive: 1
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Create a fire obelisk at target location. Fire obelisk deal damage to entities that are near the obelisk."
    },
    "fire_obelisk_area": {
        name: "Fire Obelisk Area",
        path: "textures/ui/magic_list/fire_obelisk_area",
        attribute: [ "creation", "fire" ],
        grade: "advance",
        type: "create",
        cast_duration: 20,
        soul_cost: 22,
        function: magicFunction.castMultipleLocation,
        modifier: {
            formation: [
                [ "X", "O", "X" ],
                [ "O", "O", "O" ],
                [ "X", "O", "X" ]
            ],
            gap: 5,
            ancor: [ 2, 2 ],
            focus: { x: 0, y: 0, z: 0 },
            offset: { x: 0, y: 5, z: 0 },
            impact: {
                id: magicFunction.summonAtFloor,
                modifier: {
                    type: "amw:fire_obelisk",
                    despawn:  {
                        magic_attributes: [
                            {
                                magic_type: "fire_magic",
                                multiply: 20,
                                additive: 200
                            }
                        ]
                    },
                    round_location: true,
                    spell: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.summonAtLocation,
                                    modifier: {
                                        type: "amw:solid_entity<h2>",
                                        despawn:  {
                                            magic_attributes: [
                                                {
                                                    magic_type: "fire_magic",
                                                    multiply: 20,
                                                    additive: 200
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.burstCast,
                                    modifier: {
                                        duration:  {
                                            magic_attributes: [
                                                {
                                                    magic_type: "fire_magic",
                                                    multiply: 20,
                                                    additive: 199
                                                }
                                            ]
                                        },
                                        delay: 20,
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.iterationCast,
                                                        modifier: {
                                                            iteration: 3,
                                                            spell: {
                                                                id: magicFunction.createParticle,
                                                                modifier: {
                                                                    particle: "magic:fire_spread_magic_effect",
                                                                    offset: { x: 0, y: 1.5, z: 0 }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 6,
                                                            impact: {
                                                                id: magicFunction.setFire,
                                                                modifier: {
                                                                    strength: {
                                                                        magic_attributes: [
                                                                            {
                                                                                magic_type: "fire_magic",
                                                                                multiply: 1,
                                                                                additive: 1
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Create four fire obelisk at near caster. Fire obelisk deal damage to entities that are near the obelisk."
    },
    "decoy_obelisk": {
        name: "Decoy Obelisk",
        path: "textures/ui/magic_list/decoy_obelisk",
        attribute: [ "creation", "dark" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 18,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 18,
            impact: {
                id: magicFunction.decoyObelisk,
                modifier: {
                }
            }
        },
        description: "Create a decoy obelisk at target location. Decoy obelisk can cause shock damage to entities near the obelisk."
    },
    "levitate": {
        name: "Levitate",
        path: "textures/ui/magic_list/levitate",
        attribute: [ "conjuration", "wind" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 20,
        soul_cost: 12,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<wind_orb>",
            power: 0.4,
            duration: 40,
            particles: "minecraft:explosion_manual",
            impact: {
                id: magicFunction.distanceTarget,
                modifier: {
                    distance: 5,
                    impact: {
                        id: magicFunction.levitate,
                        modifier: {
                            duration: 100,
                            height: {
                                magic_attributes: [
                                    {
                                        magic_type: "wind_magic",
                                        multiply: 0.5,
                                        additive: 1
                                    }
                                ]
                            }
                        }
                    }

                }
            }
        },
        description: "Conjures a magic orb that levitate the target entities."
    },
    "water_fountain": {
        name: "Water Fountain",
        path: "textures/ui/magic_list/water_fountain",
        attribute: [ "transmutation", "water" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 16,
            set_to_floor: true,
            impact: {
                id: magicFunction.burstCast,
                modifier: {
                    duration: 200,
                    enable_cooldown: false,
                    spell: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.createParticle,
                                    modifier: {
                                        particle: "magic:water_fountain",
                                        data: [
                                            {
                                                name: "modifier",
                                                data: {
                                                    x: 10,
                                                    y: 2,
                                                    z: 10
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: {
                                            x: 3,
                                            y: 7,
                                            z: 3
                                        },
                                        offset: {
                                            x: 0,
                                            y: 4,
                                            z: 0
                                        },
                                        include_actor: true,
                                        impact: {
                                            id: magicFunction.floating,
                                            modifier: {
                                                strength: 0.7,
                                                height: 10
                                            }
                                        }
                    
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Create a stream of water fountain that lift nearest entities."
    },
    "aero_walk": {
        name: "Aero Walk",
        path: "textures/ui/magic_list/aero_walk",
        attribute: [ "conjuration", "wind" ],
        grade: "advance",
        type: "action",
        cast_duration: 8,
        soul_cost: 24,
        function: magicFunction.burstCast,
        modifier: {
            duration: 800,
            enable_cooldown: true,
            force_slot: false,
            spell: {
                id: magicFunction.castMultipleLocation,
                modifier: {
                    formation: [
                        [ "X", "X", "X"],
                        [ "X", "X", "X"],
                        [ "X", "X", "X"]
                    ],
                    gap: 0.5,
                    ancor: [ 2, 2 ],
                    offset: { x: 0, y: -0.4999999, z: 0 },
                    focus: "self",
                    impact: {
                        id: magicFunction.summonAtLocation,
                        modifier: {
                            type: "amw:solid_entity<h0.5>",
                            despawn: 2,
                            round_y: true
                        }
                    }
                }
            }
        },
        description: "Make caster able to walk in air."
    },
    "explosion": {
        name: "Explosion",
        path: "textures/ui/magic_list/explosion",
        attribute: [ "destruction", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 20,
        soul_cost: 13,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<fire_orb>",
            particles: "magic:fireball_effect",
            power: {
                magic_attributes: [
                    {
                        magic_type: "fire_magic",
                        multiply: 0.1,
                        additive: 0.3
                    }
                ]
            },
            duration: 80,
            impact: {
                id: magicFunction.explosion,
                modifier: {
                    radius: {
                        magic_attributes: [
                            {
                                magic_type: "fire_magic",
                                multiply: 0.3,
                                additive: 0.3
                            }
                        ]
                    }
                }
            }
        },
        description: "Create a magic orb that can explode when hit target."
    },
    "devine_judgement": {
        name: "Devine Judgement",
        path: "textures/ui/magic_list/devine_judgement",
        attribute: [ "transmutation", "light" ],
        grade: "advance",
        type: "create",
        cast_duration: 28,
        soul_cost: 24,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "devine_judgement",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: -60,
                                    additive: 2400
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.createSourceDummy,
                    modifier: {
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.createParticle,
                                        modifier: {
                                            particle: "magic:area_circle",
                                            offset: {
                                                x: 0,
                                                y: 0.01,
                                                z: 0
                                            },
                                            data: [
                                                {
                                                    name: "data",
                                                    data: {
                                                        x: 16,
                                                        y: 25,
                                                        z: 31
                                                    }
                                                },
                                                {
                                                    name: "data_2",
                                                    data: {
                                                        x: 0,
                                                        y: 0,
                                                        z: 0
                                                    }
                                                },
                                                {
                                                    name: "color",
                                                    data: {
                                                        red: 0.9,
                                                        green: 0.84,
                                                        blue: 0.04,
                                                        alpha: 0.45
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: magicFunction.burstCast,
                                        modifier: {
                                            delay: 50,
                                            duration: 500,
                                            enable_cooldown: false,
                                            force_slot: false,
                                            can_cancel: false,
                                            spell: {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: 16,
                                                    single_scan: true,
                                                    exclude_families: [ "inanimate" ],
                                                    impact: {
                                                        id: magicFunction.castMultipleLocation,
                                                        modifier: {
                                                            formation: [
                                                                [ "X" ]
                                                            ],
                                                            gap: 1,
                                                            ancor: [ 1, 1 ],
                                                            focus: { x: 0, y: -1, z: 0 },
                                                            offset: { x: 0, y: 32, z: 0 },
                                                            impact: {
                                                                id: magicFunction.castSpellAtView,
                                                                modifier: {
                                                                    range: 32,
                                                                    impact: {
                                                                        id: magicFunction.sequenceCast,
                                                                        modifier: {
                                                                            delay: 7,
                                                                            spell: [
                                                                                {
                                                                                    id: magicFunction.createCircleBlastFromSource,
                                                                                    modifier: {
                                                                                        r: 1,
                                                                                        g: 0.9,
                                                                                        b: 0.1,
                                                                                        a: 0.25,
                                                                                        size: 3,
                                                                                        duration: 0.9,
                                                                                        offset: {x: 0, y: 0.2, z: 0}
                                                                                    }
                                                                                },
                                                                                {
                                                                                    id: magicFunction.burstCast,
                                                                                    modifier: {
                                                                                        duration: 5,
                                                                                        spell: {
                                                                                            id: magicFunction.lightBeam,
                                                                                            modifier: {
                                                                                                strength: {
                                                                                                    magic_attributes: [
                                                                                                        {
                                                                                                            magic_type: "light_magic",
                                                                                                            multiply: 1,
                                                                                                            additive: 2
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                {
                                                                                    id: magicFunction.explosion,
                                                                                    modifier: {
                                                                                        radius: 4,
                                                                                        break: true,
                                                                                        underwater: false
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        description: "Conjure a magic area that can damaging entitiy using light magic."
    },
    "sonic_boom": {
        name: "Sonic Boom",
        path: "textures/ui/magic_list/sonic_boom",
        attribute: [ "transmutation", "void", "dark" ],
        grade: "advance",
        type: "create",
        cast_duration: 48,
        soul_cost: 34,
        function: magicFunction.sonicBoom,
        modifier: {
            strength: {
                magic_attributes: [
                    {
                        magic_type: "void_magic",
                        multiply: 3,
                        additive: 8
                    },
                    {
                        magic_type: "dark_magic",
                        multiply: 3,
                        additive: 0
                    }
                ]
            },
            length: 8
        },
        description: "Create an imitation of a sonic boom from Warden's attack ability."
    },
    "mutation_vines": {
        name: "Mutation Vines",
        path: "textures/ui/magic_list/mutation_vines",
        attribute: [ "transmutation", "nature" ],
        grade: "intermediate",
        type: "curse",
        cast_duration: 25,
        soul_cost: 21,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 32,
            impact: {
                id: magicFunction.summonAtFloor,
                modifier: {
                    type: "amw:mutation_vines",
                    despawn: 100,
                    spell: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.createParticle,
                                    modifier: {
                                        particle: "magic:area_circle",
                                        offset: {
                                            x: 0,
                                            y: 0.01,
                                            z: 0
                                        },
                                        data: [
                                            {
                                                name: "data",
                                                data: {
                                                    x: 4,
                                                    y: 5,
                                                    z: 15
                                                }
                                            },
                                            {
                                                name: "data_2",
                                                data: {
                                                    x: 1,
                                                    y: 0,
                                                    z: 0
                                                }
                                            },
                                            {
                                                name: "color",
                                                data: {
                                                    red: 0.49,
                                                    green: 0.91,
                                                    blue: 0.4,
                                                    alpha: 0.5
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 1.5,
                                        impact: {
                                            id: magicFunction.setAttributeTarget,
                                            modifier: {
                                                duration: 100,
                                                attributes: [
                                                    {
                                                        type: "minecraft:movement",
                                                        multiply: 0
                                                    }
                                                ],
                                                immobilize: true,
                                                prevent_jump: true,
                                                prevent_rotation: true
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Create a vine that immobilize target."
    },
    "self_healing": {
        name: "Self Healing",
        path: "textures/ui/magic_list/heals",
        attribute: [ "restoration", "light" ],
        grade: "basic",
        type: "enchance",
        cast_duration: 45,
        soul_cost: 25,
        function: magicFunction.burstCast,
        modifier: {
            duration: 15,
            delay: 0,
            enable_cooldown: true,
            spell: {
                id: magicFunction.healing,
                modifier: {
                    strength: {
                        magic_attributes: [
                            {
                                magic_type: "light_magic",
                                multiply: 0.1,
                                additive: 0.2
                            }
                        ]
                    }
                }
            }
        },
        description: "Heals your health and hunger."
    },
    "devine_healing": {
        name: "Devine Healing",
        path: "textures/ui/magic_list/devine_healing",
        attribute: [ "restoration", "light" ],
        grade: "advance",
        type: "enchance",
        cast_duration: 25,
        soul_cost: 25,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.createParticle,
                    modifier: {
                        particle: "magic:magic_swirl",
                        offset: {
                            x: 0,
                            y: 1,
                            z: 0
                        },
                        data: [
                            {
                                name: "modifier",
                                data: {
                                    x: 4,
                                    y: 0.5,
                                    z: 0
                                }
                            },
                            {
                                name: "color",
                                data: {
                                    red: 0.93,
                                    green: 0.86,
                                    blue: 0.12,
                                    alpha: 0.5
                                }
                            }
                        ]
                    }
                },
                {
                    id: magicFunction.distanceTarget,
                    modifier: {
                        distance: { x: 8, y: 4, z: 8 },
                        type: "minecraft:player",
                        include_actor: true,
                        include_source: true,
                        impact: {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 200,
                                delay: 5,
                                enable_cooldown: true,
                                spell: {
                                    id: magicFunction.healing,
                                    modifier: {
                                        strength: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "light_magic",
                                                    multiply: 0.2,
                                                    additive: 0.2
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Heals all players at near caster."
    },
    "aegis": {
        name: "Aegis",
        path: "textures/ui/magic_list/aegis",
        attribute: [ "restoration", "light" ],
        grade: "advance",
        type: "enchance",
        cast_duration: 10,
        soul_cost: 35,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "aegis",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: -10,
                                    additive: 400
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.summonAtLocation,
                    modifier: {
                        type: "amw:aegis_aura<set_charged>",
                        despawn: 400,
                        spell: {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 399,
                                spell: {
                                    id: magicFunction.teleportToTarget,
                                    modifier: {
                                        head_location: true,
                                        use_rotation: false
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: 400,
                        enable_cooldown: false,
                        force_slot: false,
                        can_cancel: false,
                        spell: {
                            id: magicFunction.setEffect,
                            modifier: {
                                effect: "resistance",
                                duration: 2,
                                amplifier: 255,
                                particle: false
                            }
                        }
                    }
                }
            ]
        },
        description: "Conjure a following magic shield that can protect caster."
    },
    "magic_lasso": {
        name: "Magic Lasso",
        path: "textures/ui/magic_list/magic_lasso",
        attribute: [ "conjuration", "nature" ],
        grade: "advance",
        type: "action",
        cast_duration: 30,
        soul_cost: 23,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<nature_orb>",
            power: 0.6,
            duration: 40,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:magic_swirl",
                                offset: {
                                    x: 0,
                                    y: 1,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "modifier",
                                        data: {
                                            x: 4,
                                            y: 0.4,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.49,
                                            green: 0.91,
                                            blue: 0.4,
                                            alpha: 1.0
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: magicFunction.distanceTarget,
                            modifier: {
                                distance: 4,
                                include_source: true,
                                impact: {
                                    id: magicFunction.burstCast,
                                    modifier: {
                                        duration: 400,
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.createLineSpellActorToSource,
                                                        modifier: {
                                                            r: 0.49,
                                                            g: 0.91,
                                                            b: 0.4,
                                                            start: "self",
                                                            end: "actor"
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.setKnockbackToTarget,
                                                        modifier: {
                                                            target: "actor",
                                                            deadzone: 8,
                                                            offset: {
                                                                x: 0,
                                                                y: 2,
                                                                z: 0
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Conjure a magic orb that could pull target like lasso."
    },
    "magnetism": {
        name: "Magnetism",
        path: "textures/ui/magic_list/magnetism",
        attribute: [ "conjuration", "thunder" ],
        grade: "advance",
        type: "action",
        cast_duration: 30,
        soul_cost: 23,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<thunder_orb>",
            power: 0.9,
            duration: 30,
            impact: {
                id: magicFunction.distanceTarget,
                modifier: {
                    distance: 2,
                    single_scan: true,
                    impact: {
                        id: magicFunction.burstCast,
                        modifier: {
                            duration: 200,
                            spell: {
                                id: magicFunction.distanceTarget,
                                modifier: {
                                    distance: 12,
                                    impact:  {
                                        id: magicFunction.setKnockbackToTarget,
                                        modifier: {
                                            target: "source",
                                            deadzone: 2,
                                            offset: {
                                                x: 0,
                                                y: 1,
                                                z: 0
                                            },
                                            strength: {
                                                magic_attributes: [
                                                    {
                                                        magic_type: "thunder_magic",
                                                        multiply: 0.2,
                                                        additive: 0.2
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: "Conjure a magic orb. When orb hit target it will pull near entities towards target."
    },
    "soul_detection": {
        name: "Soul Detection",
        path: "textures/ui/magic_list/soul_detection",
        attribute: [ "conjuration", "nature" ],
        grade: "advance",
        type: "enchance",
        cast_duration: 30,
        soul_cost: 23,
        function: magicFunction.distanceTarget,
        modifier: {
            distance: 64,
            exclude_families: [ "inanimate" ],
            impact: {
                id: magicFunction.summonAtLocation,
                modifier: {
                    type: "amw:soul_viewer",
                    despawn: 400,
                    spell: {
                        id: magicFunction.burstCast,
                        modifier: {
                            duration: 399,
                            spell: {
                                id: magicFunction.castMultipleSpell,
                                modifier: {
                                    spell: [
                                        {
                                            id: magicFunction.playAnimation,
                                            modifier: {
                                                animation: "animation.general.invisible_root",
                                                show_to: "except_actor"
                                            }
                                        },
                                        {
                                            id: magicFunction.teleportToTarget,
                                            modifier: {
                                                head_location: true
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        description: "Conjure a magic that showing entity souls."
    },
    "book_of_healing": {
        name: "Book Of Healing",
        path: "textures/ui/magic_list/book_of_healing",
        attribute: [ "restoration", "light" ],
        grade: "advance",
        type: "enchance",
        cast_duration: 33,
        soul_cost: 21,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "light_magic",
                        multiply: 50,
                        additive: 400
                    }
                ]
            },
            delay: 2,
            enable_cooldown: true,
            force_slot: false,
            spell: {
                id: magicFunction.distanceTarget,
                modifier: {
                    distance: {
                        magic_attributes: [
                            {
                                magic_type: "light_magic",
                                multiply: 1,
                                additive: 7
                            }
                        ]
                    },
                    exclude_families: [ "monster", "inamimate" ],
                    impact: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.healing,
                                    modifier: {
                                        strength: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "light_magic",
                                                    multiply: 0.1,
                                                    additive: 0.1
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.createLineSpellActorToSource,
                                    modifier: {
                                        r: 0.08,
                                        g: 0.72,
                                        b: 0.55,
                                        duration: 2,
                                        start: "self",
                                        end: "actor"
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Heals all nearby players or animals."
    },
    "blood_drain": {
        name: "Blood Drain",
        path: "textures/ui/magic_list/blood_drain",
        attribute: [ "restoration", "dark" ],
        grade: "advance",
        type: "enchance",
        cast_duration: 23,
        soul_cost: 21,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "dark_magic",
                        multiply: 30,
                        additive: 150
                    }
                ]
            },
            enable_cooldown: true,
            use_animation: false,
            spell: {
                id: magicFunction.sourceTest,
                modifier: {
                    health: {
                        in_percent: true,
                        operator: "<",
                        value: 99
                    },
                    spell: {
                        id: magicFunction.castSpellAtView,
                        modifier: {
                            range: 13,
                            impact: {
                                id: magicFunction.distanceTarget,
                                modifier: {
                                    distance: 4,
                                    exclude_families: [ "inamimate", "undead" ],
                                    impact: {
                                        id: magicFunction.castMultipleSpell,
                                        modifier: {
                                            spell: [
                                                {
                                                    id: magicFunction.healing,
                                                    modifier: {
                                                        strength: -0.05
                                                    }
                                                },
                                                {
                                                    id: magicFunction.createLineSpellActorToSource,
                                                    modifier: {
                                                        r: 0.58,
                                                        g: 0.08,
                                                        b: 0.0,
                                                        start: "self",
                                                        end: "actor"
                                                    }
                                                },
                                                {
                                                    id: magicFunction.castAtActor,
                                                    modifier: {
                                                       spell: {
                                                            id: magicFunction.castMultipleSpell,
                                                            modifier: {
                                                                spell: [
                                                                    {
                                                                        id: magicFunction.healing,
                                                                        modifier: {
                                                                            strength: 0.025
                                                                        }
                                                                    },
                                                                    {
                                                                        id: magicFunction.playAnimation,
                                                                        modifier: {
                                                                            animation: "animation.item_hand.rising",
                                                                            controller: "pulling_controller"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                       }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: "Drain health from target to caster."
    },
    "thundering": {
        name: "Thundering",
        path: "textures/ui/magic_list/thundering",
        attribute: [ "transmutation", "thunder" ],
        grade: "basic",
        type: "create",
        cast_duration: 13,
        soul_cost: 15,
        function: magicFunction.burstCast,
        modifier: {
            duration: 300,
            delay: 7,
            enable_cooldown: true,
            spell: {
                id: magicFunction.distanceTarget,
                modifier: {
                    single_scan: true,
                    distance: 7,
                    exclude_families: [ "inanimate" ],
                    impact: {
                        id: magicFunction.sequenceCast,
                        modifier: {
                            delay: 5,
                            spell: [
                                {
                                    id: magicFunction.thunderStreak,
                                    modifier: {
                                        strength: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "thunder_magic",
                                                    multiply: 1,
                                                    additive: 2
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        single_scan: true,
                                        distance: 7,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.thunderStreak,
                                            modifier: {
                                                strength: {
                                                    magic_attributes: [
                                                        {
                                                            magic_type: "thunder_magic",
                                                            multiply: 0.5,
                                                            additive: 1
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    empty_spell: {
                        id: magicFunction.castRandomRotatedSpell,
                        modifier: {
                            strength: 0.8,
                            head_location: true,
                            spell: {
                                id: magicFunction.castSpellInlineView,
                                modifier: {
                                    distance: 3,
                                    deadzone: 2,
                                    gap: 3,
                                    spell: {
                                        id: magicFunction.thunderStreak,
                                        modifier: {
                                            strength: {
                                                magic_attributes: [
                                                    {
                                                        magic_type: "thunder_magic",
                                                        multiply: 0.5,
                                                        additive: 1
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: "Conjure a thunder near caster for a several seconds."
    },
    "cumulonimbus": {
        name: "Cumulonimbus",
        path: "textures/ui/magic_list/cumulonimbus",
        attribute: [ "transmutation", "thunder" ],
        grade: "expert",
        type: "create",
        cast_duration: 43,
        soul_cost: 55,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 128,
            create_new_source: true,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.addVolume,
                            modifier: {
                                type: "amw:fog_rain",
                                size: 25,
                                duration: 600
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 600,
                                delay: 30,
                                enable_cooldown: true,
                                force_slot: false,
                                can_cancel: false,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.createParticle,
                                                modifier: {
                                                    offset: { x: 0, y: 24, z: 0 },
                                                    particle: "magic:cumulonimbus_area"
                                                }
                                            },
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    single_scan: true,
                                                    distance: 24,
                                                    exclude_families: [ "inanimate" ],
                                                    impact: {
                                                        id: magicFunction.sequenceCast,
                                                        modifier: {
                                                            delay: 5,
                                                            spell: [
                                                                {
                                                                    id: magicFunction.lightning,
                                                                    modifier: {
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.distanceTarget,
                                                                    modifier: {
                                                                        distance: 6,
                                                                        exclude_families: [ "inanimate" ],
                                                                        impact: {
                                                                            id: magicFunction.thunderStreak,
                                                                            modifier: {
                                                                                strength: {
                                                                                    magic_attributes: [
                                                                                        {
                                                                                            magic_type: "thunder_magic",
                                                                                            multiply: 1,
                                                                                            additive: 1
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Conjure a cumulonimbus that will strike a lightning."
    },
    "turn_undead": {
        name: "Turn Undead",
        path: "textures/ui/magic_list/turn_undead",
        attribute: [ "destruction", "light" ],
        grade: "advance",
        type: "curse",
        cast_duration: 33,
        soul_cost: 21,
        function: magicFunction.createSourceDummy,
        modifier: {
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:area_circle",
                                offset: {
                                    x: 0,
                                    y: 0.01,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "data",
                                        data: {
                                            x: 10,
                                            y: 60,
                                            z: 30
                                        }
                                    },
                                    {
                                        name: "data_2",
                                        data: {
                                            x: 0,
                                            y: 0,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.8,
                                            green: 0.96,
                                            blue: 1.0,
                                            alpha: 0.5
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:area_circle_blend",
                                offset: {
                                    x: 0,
                                    y: 0.01,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "data",
                                        data: {
                                            x: 10,
                                            y: 60,
                                            z: 30
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.5,
                                            green: 0.86,
                                            blue: 1.0,
                                            alpha: 0.5
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 1200,
                                delay: 5,
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 10,
                                        families: [ "undead" ],
                                        impact: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.damageToSource,
                                                        modifier: {
                                                            strength: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "thunder_magic",
                                                                        multiply: 0.2,
                                                                        additive: 0.1
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.sourceTest,
                                                        modifier: {
                                                            health: {
                                                                operator: "<",
                                                                value: 10
                                                            },
                                                            spell: {
                                                                id: magicFunction.sequenceCast,
                                                                modifier: {
                                                                    spell: [
                                                                        {
                                                                            id: magicFunction.createBoxParticleFromSource,
                                                                            modifier: {
                                                                                size: 1,
                                                                                duration: 10,
                                                                                height: 4,
                                                                                r: 0.8,
                                                                                g: 0.96,
                                                                                b: 1.0,
                                                                                a: 0.5
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.instantKill,
                                                                            modifier: {
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.createBoxParticleFromSource,
                                                                            modifier: {
                                                                                size: 0.9,
                                                                                duration: 12,
                                                                                height: 3,
                                                                                r: 0.8,
                                                                                g: 0.96,
                                                                                b: 1.0,
                                                                                a: 0.4
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.createBoxParticleFromSource,
                                                                            modifier: {
                                                                                size: 0.8,
                                                                                duration: 14,
                                                                                height: 2,
                                                                                r: 0.8,
                                                                                g: 0.96,
                                                                                b: 1.0,
                                                                                a: 0.2
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.createBoxParticleFromSource,
                                                                            modifier: {
                                                                                size: 0.7,
                                                                                duration: 16,
                                                                                height: 1,
                                                                                r: 0.8,
                                                                                g: 0.96,
                                                                                b: 1.0,
                                                                                a: 0.1
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Create a purification area that can instant kill undead that have less than 10 health."
    },
    "area_heals": {
        name: "Area Heals",
        path: "textures/ui/magic_list/area_heals",
        attribute: [ "restoration", "light" ],
        grade: "intermediate",
        type: "enchance",
        cast_duration: 27,
        soul_cost: 18,
        function: magicFunction.createSourceDummy,
        modifier: {
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 200,
                                delay: 4,
                                enable_cooldown: false,
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: {x: 8, y: 8, z: 8},
                                        include_actor: true,
                                        include_source: true,
                                        exclude_families: [ "monster" ],
                                        impact: {
                                            id: magicFunction.healing,
                                            modifier: {
                                                strength: {
                                                    magic_attributes: [
                                                        {
                                                            magic_type: "light_magic",
                                                            multiply: 0.3,
                                                            additive: 0.3
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 8,
                                duration: 200,
                                height: 2,
                                r: 0.43,
                                g: 1,
                                b: 0.73,
                                a: 0.5
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 6,
                                duration: 200,
                                height: 1.5,
                                r: 0.43,
                                g: 1,
                                b: 0.73,
                                a: 0.3
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 4,
                                duration: 200,
                                height: 1,
                                r: 0.43,
                                g: 1,
                                b: 0.73,
                                a: 0.25
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 2,
                                duration: 200,
                                height: 0.5,
                                r: 0.43,
                                g: 1,
                                b: 0.73,
                                a: 0.25
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 0.5,
                                duration: 200,
                                height: 2.5,
                                r: 0.43,
                                g: 1,
                                b: 0.73,
                                a: 0.5
                            }
                        }
                    ]
                }
            }
        },
        description: "Create a healing area that linger for several seconds."
    },
    "lava_land": {
        name: "Lava Land",
        path: "textures/ui/magic_list/lava_land",
        attribute: [ "transmutation", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 55,
        soul_cost: 35,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 96,
            set_to_floor: true,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 10,
                                            additive: 150
                                        }
                                    ]
                                },
                                delay: 4,
                                enable_cooldown: false,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: {
                                                        x: 6, y: 6, z: 6
                                                    },
                                                    offset: {
                                                        x: 0, y: 3, z: 0
                                                    },
                                                    impact: {
                                                        id: magicFunction.setFire,
                                                        modifier: {
                                                            strength: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "fire_magic",
                                                                        multiply: 1,
                                                                        additive: 1
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.createParticle,
                                                modifier: {
                                                    particle: "magic:fire_land_circle",
                                                    data: [
                                                        {
                                                            name: "scale",
                                                            data: 4
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 0.5,
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 10,
                                            additive: 150
                                        }
                                    ]
                                },
                                height: 8,
                                r: 0.97,
                                g: 0.98,
                                b: 0.89,
                                a: 0.55
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 1,
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 10,
                                            additive: 150
                                        }
                                    ]
                                },
                                height: 5,
                                r: 0.97,
                                g: 0.68,
                                b: 0.19,
                                a: 0.3
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 2,
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 10,
                                            additive: 150
                                        }
                                    ]
                                },
                                height: 4,
                                r: 0.97,
                                g: 0.88,
                                b: 0.19,
                                a: 0.3
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 4,
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 10,
                                            additive: 150
                                        }
                                    ]
                                },
                                height: 3,
                                r: 0.97,
                                g: 0.68,
                                b: 0.19,
                                a: 0.3
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 6,
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 10,
                                            additive: 150
                                        }
                                    ]
                                },
                                height: 2,
                                r: 0.97,
                                g: 0.38,
                                b: 0.01,
                                a: 0.3
                            }
                        }
                    ]
                }
            }
        },
        description: "Create a arena that can burn at targeted location."
    },
    "purify": {
        name: "Purify",
        path: "textures/ui/magic_list/purify",
        attribute: [ "restoration", "light" ],
        grade: "intermediate",
        type: "enchance",
        cast_duration: 45,
        soul_cost: 20,
        function: magicFunction.purify,
        modifier: {
        },
        description: "Purify yourself from harmful effects."
    },
    "self_rewind": {
        name: "Self Rewind",
        path: "textures/ui/magic_list/self_rewind",
        attribute: [ "restoration", "dark", "void" ],
        grade: "expert",
        type: "action",
        cast_duration: 7,
        soul_cost: 50,
        function: magicFunction.burstCast,
        modifier: {
            duration: 200,
            delay: 0,
            enable_cooldown: true,
            spell: {
                id: magicFunction.rewind,
                modifier: {
                }
            },
            stop_spell: {
                id: magicFunction.stopRewind,
                modifier: {
                }
            }
        },
        description: "Travel back for a maximum of 10 seconds."
    },
    "flight": {
        name: "Flight",
        path: "textures/ui/magic_list/flight",
        attribute: [ "conjuration", "wind" ],
        grade: "expert",
        type: "action",
        cast_duration: 75,
        soul_cost: 45,
        function: magicFunction.flight,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "wind_magic",
                        multiply: 40,
                        additive: 300
                    }
                ]
            }
        },
        description: "Make caster able to fly."
    },
    "astral_mount": {
        name: "Astral Mount",
        path: "textures/ui/magic_list/astral_mount",
        attribute: [ "conjuration", "light" ],
        grade: "advance",
        type: "summon",
        cast_duration: 28,
        soul_cost: 27,
        function: magicFunction.addMount,
        modifier: {
            type: "amw:astral_mount"
        },
        description: "Summon a magical horse."
    },
    "blessing": {
        name: "Blessing",
        path: "textures/ui/magic_list/blessing",
        attribute: [ "restoration", "light" ],
        grade: "intermediate",
        type: "enchance",
        cast_duration: 40,
        soul_cost: 15,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "blessing",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: -60,
                                    additive: 1200
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.blessing,
                    modifier: {
                        strength: {
                            to_int: true,
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 1,
                                    additive: 1,
                                }
                            ]
                        },
                        duration: 1200
                    }
                }
            ]
        },
        description: "Get a random helpful effects for 60 seconds for yourself."
    },
    "burning_wall": {
        name: "Burning Wall",
        path: "textures/ui/magic_list/burning_wall",
        attribute: [ "transmutation", "fire" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 22,
        soul_cost: 30,
        function: magicFunction.castWhenCharging,
        modifier: {
            action_type: "hold",
            duration: {
                magic_attributes: [
                    {
                        magic_type: "fire_magic",
                        multiply: 5,
                        additive: 10
                    }
                ]
            },
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.playAnimation,
                            modifier: {
                                animation: "animation.item_hand.center_pull",
                                controller: "pulling_controller"
                            }
                        },
                        {
                            id: magicFunction.castSpellAtView,
                            modifier: {
                                range: 16,
                                create_new_source: true,
                                set_to_floor: true,
                                impact: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.burstCast,
                                                modifier: {
                                                    duration: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "fire_magic",
                                                                multiply: 40,
                                                                additive: 200
                                                            }
                                                        ]
                                                    },
                                                    delay: 2,
                                                    enable_cooldown: false,
                                                    spell: {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: {
                                                                x: 1,
                                                                y: 4,
                                                                z: 1
                                                            },
                                                            offset: {
                                                                x: 0,
                                                                y: 2,
                                                                z: 0
                                                            },
                                                            include_actor: true,
                                                            exclude_families: "none",
                                                            impact: {
                                                                id: magicFunction.castMultipleSpell,
                                                                modifier: {
                                                                    spell: [
                                                                        {
                                                                            id: magicFunction.setKnockbackToTarget,
                                                                            modifier: {
                                                                                target: "source",
                                                                                inverse: true,
                                                                                strength: {
                                                                                    x: 0.5,
                                                                                    y: 0.01,
                                                                                    z: 0.5
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.setFire,
                                                                            modifier: {
                                                                                strength: {
                                                                                    magic_attributes: [
                                                                                        {
                                                                                            magic_type: "fire_magic",
                                                                                            multiply: 1,
                                                                                            additive: 2
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1.05,
                                                    duration: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "fire_magic",
                                                                multiply: 40,
                                                                additive: 200
                                                            }
                                                        ]
                                                    },
                                                    height: 3,
                                                    r: 0.76,
                                                    g: 0.31,
                                                    b: 0.08,
                                                    a: 0.4
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1,
                                                    duration: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "fire_magic",
                                                                multiply: 40,
                                                                additive: 200
                                                            }
                                                        ]
                                                    },
                                                    height: 6,
                                                    r: 0.76,
                                                    g: 0.31,
                                                    b: 0.08,
                                                    a: 0.4
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.9,
                                                    duration: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "fire_magic",
                                                                multiply: 40,
                                                                additive: 200
                                                            }
                                                        ]
                                                    },
                                                    height: 1,
                                                    r: 1.0,
                                                    g: 0.9,
                                                    b: 0.8,
                                                    a: 0.4
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Conjure a buring wall at view location."
    },
    "devine_ascension": {
        name: "Devine Ascension",
        path: "textures/ui/magic_list/devine_ascension",
        attribute: [ "destruction", "transmutation", "light" ],
        grade: "master",
        type: "action",
        cast_duration: 56,
        soul_cost: 80,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "devine_ascension_control",
                        restart_cluster: true,
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 70,
                                    additive: 100
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castWhenCharging,
                    modifier: {
                        action_type: "hold",
                        ticking_duration: true,
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 70,
                                    additive: 90
                                }
                            ]
                        },
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.playAnimation,
                                        modifier: {
                                            animation: "animation.humanoid.magic.flight",
                                            controller: "pulling_body_controller",
                                            stop_state: "!query.is_using_item",
                                            blend: 0.1
                                        }
                                    },
                                    {
                                        id: magicFunction.setKnockbackToTarget,
                                        modifier: {
                                            target: "view",
                                            remove_fall_damage: true,
                                            strength: {
                                                magic_attributes: [
                                                    {
                                                        magic_type: "light_magic",
                                                        multiply: 0.3,
                                                        additive: 0.2
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.addSingleScan,
                                        modifier: {
                                            cluster_name: "devine_ascension_control",
                                            duration: 5
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            blocking: {
                                                operator: "<",
                                                value: 4
                                            },
                                            spell: {
                                                id: magicFunction.explosion,
                                                modifier: {
                                                    radius: 4,
                                                    break: true,
                                                    underwater: true
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            velocity: {
                                                operator: "<",
                                                value: 0.05
                                            },
                                            spell: {
                                                id: magicFunction.explosion,
                                                modifier: {
                                                    radius: 4,
                                                    break: true,
                                                    underwater: true
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            is_on_ground: true,
                                            spell: {
                                                id: magicFunction.explosion,
                                                modifier: {
                                                    radius: 4,
                                                    break: true,
                                                    underwater: true
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 70,
                                    additive: 90
                                }
                            ]
                        },
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.createParticle,
                                        modifier: {
                                            particle: "magic:light_effect",
                                            offset: {
                                                x: 0,
                                                y: 1.5,
                                                z: 0
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            is_sneaking: true,
                                            spell: {
                                                id: magicFunction.stopCast,
                                                modifier: {}
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            single_scan:{
                                                cluster_name: "devine_ascension_control"
                                            },
                                            is_jumping: false,
                                            spell: {
                                                id: magicFunction.setKnockbackToTarget,
                                                modifier: {
                                                    remove_fall_damage: true,
                                                    target: "self",
                                                    offset: {
                                                        x: 0, 
                                                        y: 0.005, 
                                                        z: 0
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.sourceTest,
                                        modifier: {
                                            single_scan:{
                                                cluster_name: "devine_ascension_control"
                                            },
                                            is_jumping: true,
                                            spell: {
                                                id: magicFunction.setKnockbackToTarget,
                                                modifier: {
                                                    remove_fall_damage: true,
                                                    target: "self",
                                                    offset: {
                                                        x: 0, 
                                                        y: 0.5, 
                                                        z: 0
                                                    },
                                                    strength: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "light_magic",
                                                                multiply: 0.1,
                                                                additive: 0.1
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        stop_spell: {
                            id: magicFunction.castCooldown,
                            modifier: {
                                cooldown_spell: "devine_ascension",
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "light_magic",
                                            multiply: -180,
                                            additive: 2400
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Make caster gain ability to fly and penetrate the wall. Interact with castign weapon to fly."
    },
    "dragon_breath": {
        name: "Dragon Breath",
        path: "textures/ui/magic_list/dragon_breath",
        attribute: [ "transmutation", "nature", "void" ],
        grade: "advance",
        type: "action",
        cast_duration: 15,
        soul_cost: 30,
        function: magicFunction.castWhenCharging,
        modifier: {
            action_type: "hold",
            duration: {
                magic_attributes: [
                    {
                        magic_type: "void_magic",
                        multiply: 20,
                        additive: 60
                    }
                ]
            },
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.playAnimation,
                            modifier: {
                                animation: "animation.item_hand.center_pull",
                                controller: "pulling_controller"
                            }
                        },
                        {
                            id: magicFunction.castRandomRotatedSpell,
                            modifier: {
                                strength: 0.1,
                                head_location: true,
                                spell: {
                                    id: magicFunction.castProjectile,
                                    modifier: {
                                        type: "amw:magic_orb_dummy",
                                        power: 1.4,
                                        despawn: 200,
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.changeProjectileComponents,
                                                        modifier: {
                                                            gravity: 0.1,
                                                            air_inertia: 0.8
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.burstCast,
                                                        modifier: {
                                                            duration: 20,
                                                            enable_cooldown: false,
                                                            spell: {
                                                                id: magicFunction.castRandomLocationSpell,
                                                                modifier: {
                                                                    size: { x: 1, y: 1, z: 1 },
                                                                    offset: { x: 0, y: 0, z: 0 },
                                                                    strength: 0.1,
                                                                    spell: {
                                                                        id: magicFunction.createParticle,
                                                                        modifier: {
                                                                            particle: "minecraft:dragon_breath_trail",
                                                                            data: []
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.projectileHitCast,
                                                        modifier: {
                                                            impact: {
                                                                id: magicFunction.createSourceDummy,
                                                                modifier: {
                                                                    spell: {
                                                                        id: magicFunction.castMultipleSpell,
                                                                        modifier: {
                                                                            spell: [
                                                                                {
                                                                                    id: magicFunction.burstCast,
                                                                                    modifier: {
                                                                                        duration: 60,
                                                                                        delay: 6,
                                                                                        enable_cooldown: false,
                                                                                        spell: {
                                                                                            id: magicFunction.distanceTarget,
                                                                                            modifier: {
                                                                                                distance: {
                                                                                                    x: 5,
                                                                                                    y: 3,
                                                                                                    z: 5
                                                                                                },
                                                                                                offset: {
                                                                                                    x: 0,
                                                                                                    y: 1.5,
                                                                                                    z: 0
                                                                                                },
                                                                                                include_actor: false,
                                                                                                impact: {
                                                                                                    id: magicFunction.damageToSource,
                                                                                                    modifier: {
                                                                                                        strength: {
                                                                                                            magic_attributes: [
                                                                                                                {
                                                                                                                    magic_type: "void_magic",
                                                                                                                    multiply: 0.1,
                                                                                                                    additive: 1
                                                                                                                },
                                                                                                                {
                                                                                                                    magic_type: "nature_magic",
                                                                                                                    multiply: 0.1,
                                                                                                                    additive: 0
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                {
                                                                                    id: magicFunction.createParticle,
                                                                                    modifier: {
                                                                                        particle: "minecraft:dragon_breath_lingering",
                                                                                        offset: {
                                                                                            x: 0,
                                                                                            y: 0.1,
                                                                                            z: 0
                                                                                        },
                                                                                        data: [
                                                                                            {
                                                                                                name: "cloud_radius",
                                                                                                data: 5
                                                                                            },
                                                                                            {
                                                                                                name: "cloud_lifetime",
                                                                                                data: 1
                                                                                            },
                                                                                            {
                                                                                                name: "particle_multiplier",
                                                                                                data: 0.45
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "fire_breath": {
        name: "Fire Breath",
        path: "textures/ui/magic_list/fire_breath",
        attribute: [ "transmutation", "fire" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 20,
        soul_cost: 20,
        function: magicFunction.castWhenCharging,
        modifier: {
            action_type: "hold",
            duration: {
                magic_attributes: [
                    {
                        magic_type: "fire_magic",
                        multiply: 20,
                        additive: 60
                    }
                ]
            },
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.playAnimation,
                            modifier: {
                                animation: "animation.item_hand.center_pull",
                                controller: "pulling_controller"
                            }
                        },
                        {
                            id: magicFunction.fireBreath,
                            modifier: {
                                strength: 3
                            }
                        }
                    ]
                }
            }
        },
        description: "Make caster able to breathe a fire."
    },
    "machine_gun_arrow": {
        name: "Machine Gun Arrow",
        path: "textures/ui/magic_list/machine_gun_arrow",
        attribute: [ "creation", "manipulation", "nature" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 26,
        soul_cost: 40,
        function: magicFunction.castWhenCharging,
        modifier: {
            action_type: "hold",
            duration: {
                magic_attributes: [
                    {
                        magic_type: "nature_magic",
                        multiply: 10,
                        additive: 30
                    }
                ]
            },
            spell:  {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.playAnimation,
                            modifier: {
                                animation: "animation.item_hand.center_pull",
                                controller: "pulling_controller"
                            }
                        },
                        {
                            id: magicFunction.castRandomRotatedSpell,
                            modifier: {
                                strength: 0.075,
                                head_location: true,
                                spell: {
                                    id: magicFunction.castProjectile,
                                    modifier: {
                                        type: "amw:magic_arrow",
                                        power: 1.4,
                                        despawn: 150
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "air_vortex": {
        name: "Air Vortex",
        path: "textures/ui/magic_list/air_vortex",
        attribute: [ "transmutation", "wind" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 10,
        soul_cost: 20,
        function: magicFunction.castWhenCharging,
        modifier: {
            action_type: "hold",
            duration: 100,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.playAnimation,
                            modifier: {
                                animation: "animation.item_hand.center_pull",
                                controller: "pulling_controller"
                            }
                        },
                        {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.castSpellInlineView,
                                        modifier: {
                                            distance: 6,
                                            gap: 6,
                                            spell: {
                                                id: magicFunction.castMultipleSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.createParticle,
                                                            modifier: {
                                                                particle: "magic:wind_magic_effect",
                                                                offset: {
                                                                    x: 0,
                                                                    y: 0.1,
                                                                    z: 0
                                                                },
                                                                data: []
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.distanceTarget,
                                                            modifier: {
                                                                distance: 6,
                                                                impact: {
                                                                    id: magicFunction.setKnockbackToTarget,
                                                                    modifier: {
                                                                        target: "source",
                                                                        strength: 0.5,
                                                                        deadzone: 0.1
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            stop_spell: "spell_deactive",
            spell_deactive: {
                cast_after_used: true,
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.castSpellInlineView,
                            modifier: {
                                distance: 6,
                                gap: 6,
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 6,
                                        impact: {
                                            id: magicFunction.setKnockbackToTarget,
                                            modifier: {
                                                target: "actor",
                                                inverse: true,
                                                offset: {
                                                    x: 0,
                                                    y: 1.5,
                                                    z: 0
                                                },
                                                strength: {
                                                    magic_attributes: [
                                                        {
                                                            magic_type: "wind_magic",
                                                            multiply: 0.4,
                                                            additive: 0.75
                                                        }
                                                    ]
                                                },
                                                multiplier: {
                                                    x: 1,
                                                    y: 0.3,
                                                    z: 1
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.stopCast,
                            modifier: {}
                        }
                    ]
                }
            }
        },
        description: "Create an air vortex in front of caster view. While hold interat it will pull surrounding entities towards air vortex then after hold will throws target."
    },
    "wind_barrier": {
        name: "Wind Barrier",
        path: "textures/ui/magic_list/wind_barrier",
        attribute: [ "transmutation", "wind" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 20,
        soul_cost: 40,
        function: magicFunction.castSpellInlineDistance,
        modifier: {
            range: 32,
            length: 16,
            gap: 2,
            spell_from: {
                id: magicFunction.castCooldown,
                modifier: {
                    target: "actor",
                    cooldown_spell: "wind_barrier",
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "wind_magic",
                                multiply: 10,
                                additive: 200
                            }
                        ]
                    }
                }
            },
            spell: {
                id: magicFunction.castAtFloor,
                modifier: {
                    offset: {
                        x: 0,
                        y: 2,
                        z: 0
                    },
                    spell: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.burstCast,
                                    modifier: {
                                        duration: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "wind_magic",
                                                    multiply: 30,
                                                    additive: 200
                                                }
                                            ]
                                        },
                                        delay: 2,
                                        enable_cooldown: false,
                                        spell: {
                                            id: magicFunction.distanceTarget,
                                            modifier: {
                                                distance: {
                                                    x: 4,
                                                    y: 8,
                                                    z: 4
                                                },
                                                offset: {
                                                    x: 0,
                                                    y: 4,
                                                    z: 0
                                                },
                                                include_actor: true,
                                                exclude_families: "none",
                                                impact: {
                                                    id: magicFunction.setKnockbackToTarget,
                                                    modifier: {
                                                        target: "source",
                                                        inverse: true,
                                                        strength: {
                                                            x: 2,
                                                            y: 1,
                                                            z: 2
                                                        },
                                                        offset: {
                                                            x: 0,
                                                            y: -1,
                                                            z: 0
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 1,
                                        duration: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "wind_magic",
                                                    multiply: 30,
                                                    additive: 200
                                                }
                                            ]
                                        },
                                        height: 8,
                                        r: 0.6,
                                        g: 1.0,
                                        b: 0.8,
                                        a: 0.3
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 2,
                                        duration: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "wind_magic",
                                                    multiply: 30,
                                                    additive: 200
                                                }
                                            ]
                                        },
                                        height: 6,
                                        r: 0.5,
                                        g: 0.91,
                                        b: 0.86,
                                        a: 0.2
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 4,
                                        duration: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "wind_magic",
                                                    multiply: 30,
                                                    additive: 200
                                                }
                                            ]
                                        },
                                        height: 3,
                                        r: 0.47,
                                        g: 0.88,
                                        b: 0.79,
                                        a: 0.1
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 6,
                                        duration: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "wind_magic",
                                                    multiply: 30,
                                                    additive: 200
                                                }
                                            ]
                                        },
                                        height: 2,
                                        r: 0.47,
                                        g: 0.88,
                                        b: 0.79,
                                        a: 0.1
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Conjure a wind barrier. Wind barrier could throw targets."
    },
    "invisible_bridge": {
        name: "Invisible Bridge",
        path: "textures/ui/magic_list/invisible_bridge",
        attribute: [ "transmutation", "void" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 60,
        soul_cost: 60,
        function: magicFunction.castSpellInlineDistance,
        modifier: {
            range: 32,
            gap: 1,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "X", "X", "X" ],
                                    [ "X", "X", "X" ],
                                    [ "X", "X", "X" ]
                                ],
                                gap: 1,
                                ancor: [ 2, 2 ],
                                focus: "view",
                                offset: { x: 0, y: 0, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtLocation,
                                    modifier: {
                                        type: "amw:solid_entity<h0.5>",
                                        despawn:  {
                                            magic_attributes: [
                                                {
                                                    magic_type: "void_magic",
                                                    multiply: 80,
                                                    additive: 880
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 3,
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "void_magic",
                                            multiply: 80,
                                            additive: 880
                                        }
                                    ]
                                },
                                height: 1.5,
                                r: 0.5,
                                g: 0.6,
                                b: 0.8,
                                a: 0.25
                            }
                        }
                    ]
                }
            },
            spell_from: {
                id: magicFunction.castCooldown,
                modifier: {
                    target: "actor",
                    cooldown_spell: "invisible_bridge",
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "void_magic",
                                multiply: 80,
                                additive: 800
                            }
                        ]
                    }
                }
            }
        },
        description: "Conjure a invisible bridge. Caster can make bridge by hold interact with casting weapon and creating a line."
    },
    "spider_climb": {
        name: "Spider Climb",
        path: "textures/ui/magic_list/spider_climb",
        attribute: [ "transmutation", "dark" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 8,
        soul_cost: 13,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "dark_magic",
                        multiply: 20,
                        additive: 250
                    }
                ]
            },
            delay: 0,
            enable_cooldown: true,
            force_slot: false,
            spell: {
                id: magicFunction.wallClimb,
                modifier: {
                }
            }
        },
        description: "Make caster able to imitation of spider ability that can stick yourself into wall for several seconds."
    },
    "enchance_vegetation": {
        name: "Enchance Vegetation",
        path: "textures/ui/magic_list/enchance_vegetation",
        attribute: [ "transmutation", "nature" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 18,
        soul_cost: 13,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.createParticle,
                    modifier: {
                        particle: "magic:area_circle",
                        offset: {
                            x: 0,
                            y: 0.1,
                            z: 0
                        },
                        data: [
                            {
                                name: "data",
                                data: {
                                    x: 5,
                                    y: 1,
                                    z: 14
                                }
                            },
                            {
                                name: "data_2",
                                data: {
                                    x: 1,
                                    y: 0,
                                    z: 0
                                }
                            },
                            {
                                name: "color",
                                data: {
                                    red: 0.2,
                                    green: 0.7,
                                    blue: 0.3,
                                    alpha: 0.8
                                }
                            }
                        ]
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "X", "X", "X", "O" ],
                            [ "X", "X", "X", "X", "X" ],
                            [ "X", "X", "X", "X", "X" ],
                            [ "X", "X", "X", "X", "X" ],
                            [ "O", "X", "X", "X", "O" ]
                        ],
                        gap: 1,
                        ancor: [ 3, 3 ],
                        focus: "view",
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            modifier: {
                                type: "amw:magic_execution_dummy<grows_crop>",
                                despawn: 5
                            }
                        }
                    }
                }
            ]
        },
        description: "Enchance crops at near caster."
    },
    "snowball_burst": {
        name: "Snowball Burst",
        path: "textures/ui/magic_list/snowball_burst",
        attribute: [ "transmutation", "ice" ],
        grade: "basic",
        type: "create",
        cast_duration: 8,
        soul_cost: 13,
        function: magicFunction.castWhenCharging,
        modifier: {
            action_type: "hold",
            duration: {
                magic_attributes: [
                    {
                        magic_type: "ice_magic",
                        multiply: 7,
                        additive: 20
                    }
                ]
            },
            spell:  {
                id: magicFunction.castRandomRotatedSpell,
                modifier: {
                    strength: 0.05,
                    head_location: true,
                    spell: {
                        id: magicFunction.castProjectile,
                        modifier: {
                            type: "minecraft:snowball",
                            power: 1.8
                        }
                    }
                }
            }
        },
        description: "Create a barrage of snowball."
    },
    "light_source": {
        name: "Light Source",
        path: "textures/ui/magic_list/light_source",
        attribute: [ "transmutation", "light", "nature" ],
        grade: "basic",
        type: "create",
        cast_duration: 8,
        soul_cost: 13,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "light_source_control",
                        restart_cluster: true,
                        duration: 1200
                    }
                },
                {
                    id: magicFunction.summonAtLocation,
                    modifier: {
                        type: "amw:magic_light_source",
                        despawn: 1200,
                        spell: {
                            id: magicFunction.addSingleScanEntity,
                            modifier: {
                                cluster_name: "light_source_control",
                                duration: 1199
                            }
                        }
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: 1199,
                        enable_cooldown: true,
                        force_slot: false,
                        spell: {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "X" ]
                                ],
                                gap: 2,
                                ancor: [ 1, 1 ],
                                focus: { x: 0, y: 1, z: 0 },
                                offset: { x: 1.5, y: 1.2, z: -1 },
                                impact: {
                                    id: magicFunction.castAtScanEntity,
                                    modifier: {
                                        cluster_name: "light_source_control",
                                        spell: {
                                            id: magicFunction.setKnockbackToTarget,
                                            modifier: {
                                                target: "source",
                                                strength: 0.5,
                                                deadzone: 0.2
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        stop_spell: {
                            id: magicFunction.castAtScanEntity,
                            modifier: {
                                cluster_name: "light_source_control",
                                spell: {
                                    id: magicFunction.despawnTarget,
                                    modifier: {}
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Conjure a light source that emmits light. Light source will follow caster location."
    },
    "bubble_rush": {
        name: "Bubble Rush",
        path: "textures/ui/magic_list/bubble_rush",
        attribute: [ "transmutation", "conjuration", "water" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 18,
        soul_cost: 29,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "bubble_rush_effect",
                        duration: 360
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: 90,
                        delay: 2,
                        enable_cooldown: true,
                        spell: {
                            id: magicFunction.castRandomRotatedSpell,
                            modifier: {
                                strength: 0.1,
                                head_location: true,
                                spell: {
                                    id: magicFunction.castSpellOrb,
                                    modifier: {
                                        type: "amw:magic_orb<water_orb>",
                                        power: 1.6,
                                        duration: 40,
                                        create_new_source: true,
                                        particles: "minecraft:water_splash_particle_manual",
                                        impact: {
                                            id: magicFunction.distanceTarget,
                                            modifier: {
                                                distance: 2,
                                                single_scan: true,
                                                exclude_families: [ "inanimate" ],
                                                impact: {
                                                    id: magicFunction.sourceTest,
                                                    modifier: {
                                                        single_scan: {
                                                            cluster_name: "bubble_rush_effect"
                                                        },
                                                        spell: {
                                                            id: magicFunction.castMultipleSpell,
                                                            modifier: {
                                                                spell: [
                                                                    {
                                                                        id: magicFunction.summonAtLocation,
                                                                        modifier: {
                                                                            type: "amw:bubble_trap<set_small>",
                                                                            despawn: 270,
                                                                            spell: {
                                                                                id: magicFunction.burstCast,
                                                                                modifier: {
                                                                                    duration: 269,
                                                                                    spell: {
                                                                                        id: magicFunction.teleportToTarget,
                                                                                        modifier: {
                                                                                            head_location: true
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        id: magicFunction.burstCast,
                                                                        modifier: {
                                                                            duration: 269,
                                                                            spell: {
                                                                                id: magicFunction.damageToSource,
                                                                                modifier: {
                                                                                    strength: 0.3
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    {
                                                                        id: magicFunction.addSingleScan,
                                                                        modifier: {
                                                                            cluster_name: "bubble_rush_effect"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Conjure a magic orb that will attach target with bubble."
    },
    "throwing_ancor": {
        name: "Throwing Ancor",
        path: "textures/ui/magic_list/throwing_ancor",
        attribute: [ "transmutation", "creation", "nature" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 18,
        soul_cost: 19,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:ancor",
            power: {
                magic_attributes: [
                    {
                        magic_type: "nature_magic",
                        multiply: 0.1,
                        additive: 0.4
                    }
                ]
            },
            duration: 50,
            ongoing: {
                id: magicFunction.distanceTarget,
                delay: 2,
                modifier: {
                    distance: 3,
                    impact: {
                        id: magicFunction.setKnockbackToTarget,
                        modifier: {
                            target: "source"
                        }
                    }
                }
            }
        },
        description: "Throw an ancor that can hit and throw near entity."
    },
    "charged_ancor": {
        name: "Charged Ancor",
        path: "textures/ui/magic_list/charged_ancor",
        attribute: [ "transmutation", "creation", "nature", "thunder" ],
        grade: "advance",
        type: "create",
        cast_duration: 31,
        soul_cost: 37,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "charged_ancor",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "thunder_magic",
                                    multiply: -10,
                                    additive: 350
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 72,
                        create_new_source: true,
                        impact:  {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "X"]
                                ],
                                gap: 1,
                                ancor: [ 1, 1 ],
                                focus: { x: 0, y: -1, z: 0 },
                                offset: { x: 0, y: 32, z: 0 },
                                impact: {
                                    id: magicFunction.castSpellOrb,
                                    modifier: {
                                        type: "amw:ancor<set_charged>",
                                        power: 1.6,
                                        duration: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "thunder_magic",
                                                    multiply: 10,
                                                    additive: 350
                                                }
                                            ]
                                        },
                                        ongoing: {
                                            id: magicFunction.distanceTarget,
                                            delay: 10,
                                            modifier: {
                                                distance: 7,
                                                exclude_families: [ "inanimate" ],
                                                single_scan: true,
                                                impact: {
                                                    id: magicFunction.castMultipleSpell,
                                                    modifier: {
                                                        spell: [
                                                            {
                                                                id: magicFunction.thunderStreak,
                                                                modifier: {
                                                                    strength: {
                                                                        magic_attributes: [
                                                                            {
                                                                                magic_type: "thunder_magic",
                                                                                multiply: 1,
                                                                                additive: 2
                                                                            }
                                                                        ]
                                                                    },
                                                                    offset: { x: 0, y: 1.5, z: 0 }
                                                                }
                                                            },
                                                            {
                                                                id: magicFunction.distanceTarget,
                                                                delay: 10,
                                                                modifier: {
                                                                    distance: 5,
                                                                    exclude_families: [ "inanimate" ],
                                                                    single_scan: true,
                                                                    impact: {
                                                                        id: magicFunction.castMultipleSpell,
                                                                        modifier: {
                                                                            spell: [
                                                                                {
                                                                                    id: magicFunction.thunderStreak,
                                                                                    modifier: {
                                                                                        strength: {
                                                                                            magic_attributes: [
                                                                                                {
                                                                                                    magic_type: "thunder_magic",
                                                                                                    multiply: 0.45,
                                                                                                    additive: 0.5
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                },
                                                                                {
                                                                                    id: magicFunction.distanceTarget,
                                                                                    delay: 10,
                                                                                    modifier: {
                                                                                        distance: 3,
                                                                                        exclude_families: [ "inanimate" ],
                                                                                        single_scan: true,
                                                                                        impact: {
                                                                                            id: magicFunction.thunderStreak,
                                                                                            modifier: {
                                                                                                strength: {
                                                                                                    magic_attributes: [
                                                                                                        {
                                                                                                            magic_type: "thunder_magic",
                                                                                                            multiply: 0.5,
                                                                                                            additive: 1
                                                                                                        }
                                                                                                    ]
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Conjure a charged anchor at target location. Charged Ancor will take damage nearest entity by striking a lightning."
    },
    "ice_branch": {
        name: "Ice Branch",
        path: "textures/ui/magic_list/ice_branch",
        attribute: [ "transmutation", "ice" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 18,
        soul_cost: 35,
        function: magicFunction.castRotatedSpell,
        modifier: {
            count: 3,
            degree: 90,
            distance: 1.5,
            axis: "y",
            reset_axis: "x",
            spell: {
                id: magicFunction.castRandomRotatedSpell,
                modifier: {
                    strength: 0.15,
                    spell: {
                        id: magicFunction.castSpellOrb,
                        modifier: {
                            type: "amw:magic_orb_dummy",
                            power: 1.3,
                            duration: 10,
                            ongoing: {
                                delay: 2,
                                id: magicFunction.summonAtFloor,
                                modifier: {
                                    type: "amw:ice_spike",
                                    despawn: 60,
                                    spell: {
                                        id: magicFunction.distanceTarget,
                                        modifier: {
                                            distance: 3,
                                            exclude_families: [ "inanimate" ],
                                            impact: {
                                                id: magicFunction.setFreeze,
                                                modifier: {
                                                    type: "stunt",
                                                    duration: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "ice_magic",
                                                                multiply: 50,
                                                                additive: 120
                                                            }
                                                        ]
                                                    },
                                                    strength: {
                                                        to_int: true,
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "ice_magic",
                                                                multiply: 0.5,
                                                                additive: 0.1
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: ""
    },
    "ice_shard": {
        name: "Ice Shard",
        path: "textures/ui/magic_list/ice_shard",
        attribute: [ "transmutation", "ice" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 33,
        soul_cost: 13,
        function: magicFunction.castMultipleLocation,
        modifier: {
            formation: [
                [ "X"]
            ],
            gap: 1,
            ancor: [ 1, 1 ],
            focus: "view",
            offset: { x: 0, y: 16, z: 10 },
            impact: {
                id: magicFunction.castRotatedSpell,
                modifier: {
                    count: 3,
                    degree: 50,
                    distance: 1,
                    axis: "y",
                    spell: {
                        id: magicFunction.castSpellOrb,
                        modifier: {
                            type: "amw:ice_shard",
                            power: 1.8,
                            duration: 100,
                            impact: {
                                id: magicFunction.summonAtFloor,
                                modifier: {
                                    type: "amw:ice_spike<set_large>",
                                    despawn: 300,
                                    spell: {
                                        id: magicFunction.castMultipleSpell,
                                        modifier: {
                                            spell: [
                                                {
                                                    id: magicFunction.createParticle,
                                                    modifier: {
                                                        particle: "magic:area_circle_blend",
                                                        offset: {
                                                            x: 0,
                                                            y: 0.01,
                                                            z: 0
                                                        },
                                                        data: [
                                                            {
                                                                name: "data",
                                                                data: {
                                                                    x: 5,
                                                                    y: 15,
                                                                    z: 30
                                                                }
                                                            },
                                                            {
                                                                name: "color",
                                                                data: {
                                                                    red: 0.5,
                                                                    green: 0.86,
                                                                    blue: 1.0,
                                                                    alpha: 0.5
                                                                }
                                                            }
                                                        ]
                                                    }
                                                },
                                                {
                                                    id: magicFunction.burstCast,
                                                    modifier: {
                                                        duration: 300,
                                                        spell: {
                                                            id: magicFunction.distanceTarget,
                                                            modifier: {
                                                                distance: 5,
                                                                impact: {
                                                                    id: magicFunction.setFreeze,
                                                                    modifier: {
                                                                        type: "stunt",
                                                                        duration: 305,
                                                                        strength: {
                                                                            to_int: true,
                                                                            magic_attributes: [
                                                                                {
                                                                                    magic_type: "ice_magic",
                                                                                    multiply: 0.5,
                                                                                    additive: 0.1
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                } 
                            }
                        }
                    }
                }
            }
        },
        description: ""
    },
    "shepherd": {
        name: "Shepherd",
        path: "textures/ui/magic_list/shepherd",
        attribute: [ "conjuration", "nature", "dark" ],
        grade: "advance",
        type: "action",
        cast_duration: 33,
        soul_cost: 23,
        function: magicFunction.burstCast,
        modifier: {
            duration: 800,
            enable_cooldown: true,
            spell: {
                id: magicFunction.castSpellAtView,
                modifier: {
                    range: 72,
                    create_new_source: true,
                    impact: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "dark_magic",
                                                    multiply: 2,
                                                    additive: 20
                                                }
                                            ]
                                        },
                                        duration: 4,
                                        height: 2,
                                        r: 1,
                                        g: 1,
                                        b: 1,
                                        a: 0.25
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "dark_magic",
                                                    multiply: 1,
                                                    additive: 10
                                                }
                                            ]
                                        },
                                        duration: 4,
                                        height: 2,
                                        r: 1,
                                        g: 1,
                                        b: 1,
                                        a: 0.15
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 1,
                                        duration: 4,
                                        height: 5,
                                        r: 1,
                                        g: 1,
                                        b: 1,
                                        a: 0.1
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 0.5,
                                        duration: 4,
                                        height: 16,
                                        r: 1,
                                        g: 1,
                                        b: 1,
                                        a: 0.15
                                    }
                                },
                                {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "dark_magic",
                                                    multiply: 1,
                                                    additive: 10
                                                }
                                            ]
                                        },
                                        exclude_families: [ "player", "monster", "inanimate" ],
                                        deadzone: 1,
                                        impact: {
                                            id: magicFunction.navigationToTarget,
                                            modifier: {
                                                offset: {
                                                    x: 0, 
                                                    y: 1, 
                                                    z: 0
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Create an area where all animals get atracted to the target location for 40 seconds."
    },
    "skull_army": {
        name: "Skull Army",
        path: "textures/ui/magic_list/skull_army",
        attribute: [ "creation", "dark" ],
        grade: "advance",
        type: "summon",
        cast_duration: 39,
        soul_cost: 100,
        function: magicFunction.sequenceCast,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "skull_army",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "dark_magic",
                                    multiply: -30,
                                    additive: 900
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "X", "O" ],
                            [ "O", "O", "O" ],
                            [ "X", "O", "X" ]
                        ],
                        gap: 2,
                        ancor: [ 2, 2 ],
                        focus: "self",
                        offset: { x: 0, y: 4, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            modifier: {
                                type: "amw:magic_skeleton",
                                despawn: 1200,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.setEquipment,
                                                modifier: {
                                                    equipment: [
                                                        {
                                                            slot: "head",
                                                            item: {
                                                                name: "minecraft:iron_helmet"
                                                            }
                                                        },
                                                        {
                                                            slot: "offhand",
                                                            item: {
                                                                name: "minecraft:shield"
                                                            }
                                                        },
                                                        {
                                                            slot: "mainhand",
                                                            item: {
                                                                name: "minecraft:stone_sword"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                id: magicFunction.changeNameTag,
                                                modifier: {
                                                    name: "{NAME}'s Skeleton"
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1,
                                                    duration: 7,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.9,
                                                    duration: 8,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.7,
                                                    duration: 9,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.4,
                                                    duration: 10,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Summon 3 skeleton army."
    },
    "vex_army": {
        name: "Vex Army",
        path: "textures/ui/magic_list/vex_army",
        attribute: [ "creation", "dark" ],
        grade: "advance",
        type: "summon",
        cast_duration: 39,
        soul_cost: 70,
        function: magicFunction.sequenceCast,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "vex_army",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "dark_magic",
                                    multiply: -20,
                                    additive: 600
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "X", "O" ],
                            [ "O", "O", "O" ],
                            [ "X", "O", "X" ]
                        ],
                        gap: 2,
                        ancor: [ 2, 2 ],
                        focus: "self",
                        offset: { x: 0, y: 2, z: 0 },
                        impact: {
                            id: magicFunction.summonAtLocation,
                            modifier: {
                                type: "amw:magic_vex",
                                despawn: 1200,
                                spell: {
                                    id: magicFunction.changeNameTag,
                                    modifier: {
                                        name: "{NAME}'s Vex"
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "bees_army": {
        name: "Bees Army",
        path: "textures/ui/magic_list/bees_army",
        attribute: [ "creation", "nature" ],
        grade: "intermediate",
        type: "summon",
        cast_duration: 36,
        soul_cost: 33,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "bees_army",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "nature_magic",
                                    multiply: -10,
                                    additive: 350
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "X", "X", "X" ],
                            [ "X", "O", "X" ],
                            [ "O", "O", "O" ]
                        ],
                        gap: 2,
                        ancor: [ 2, 2 ],
                        focus: "self",
                        offset: { x: 0, y: 1, z: 0 },
                        impact: {
                            id: magicFunction.summonAtLocation,
                            modifier: {
                                type: "amw:bees_army",
                                despawn: 450,
                                spell: {
                                    id: magicFunction.changeNameTag,
                                    modifier: {
                                        name: "{NAME}'s Bee"
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Summon 5 bees army."
    },
    "zombie_servant": {
        name: "Zombie Servant",
        path: "textures/ui/magic_list/zombie_servant",
        attribute: [ "creation", "dark" ],
        grade: "advance",
        type: "summon",
        cast_duration: 39,
        soul_cost: 70,
        function: magicFunction.sequenceCast,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "zombie_servant",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "dark_magic",
                                    multiply: -10,
                                    additive: 300
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 16,
                        impact: {
                            id: magicFunction.summonAtFloor,
                            modifier: {
                                type: "amw:magic_zombie",
                                despawn: 6000,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.changeNameTag,
                                                modifier: {
                                                    name: "{NAME}'s Zombie"
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1,
                                                    duration: 7,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.9,
                                                    duration: 8,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.7,
                                                    duration: 9,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.4,
                                                    duration: 10,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "iron_golem_guard": {
        name: "Iron Golem Guard",
        path: "textures/ui/magic_list/iron_golem_guard",
        attribute: [ "creation", "nature" ],
        grade: "advance",
        type: "summon",
        cast_duration: 49,
        soul_cost: 90,
        function: magicFunction.sequenceCast,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "iron_golem_guard",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "nature_magic",
                                    multiply: -10,
                                    additive: 300
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 16,
                        impact: {
                            id: magicFunction.summonAtFloor,
                            modifier: {
                                type: "amw:magic_iron_golem",
                                despawn: 600,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.changeNameTag,
                                                modifier: {
                                                    name: "{NAME}'s Iron Golem"
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 2,
                                                    duration: 7,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1.9,
                                                    duration: 8,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1.7,
                                                    duration: 9,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1.4,
                                                    duration: 10,
                                                    height: 5,
                                                    r: 0.1,
                                                    g: 0.56,
                                                    b: 0.25,
                                                    a: 1
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "skeleton_servant": {
        name: "Skeleton Servant",
        path: "textures/ui/magic_list/skeleton_servant",
        attribute: [ "creation", "dark" ],
        grade: "advance",
        type: "summon",
        cast_duration: 39,
        soul_cost: 70,
        function: magicFunction.sequenceCast,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "skeleton_servant",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "dark_magic",
                                    multiply: -10,
                                    additive: 300
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 16,
                        impact: {
                            id: magicFunction.summonAtFloor,
                            modifier: {
                                type: "amw:magic_skeleton",
                                despawn: 6000,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.setEquipment,
                                                modifier: {
                                                    equipment: [
                                                        {
                                                            slot: "mainhand",
                                                            item: {
                                                                name: "minecraft:bow"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                id: magicFunction.changeNameTag,
                                                modifier: {
                                                    name: "{NAME}'s Skeleton"
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 1,
                                                    duration: 7,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.9,
                                                    duration: 8,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.7,
                                                    duration: 9,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            },
                                            {
                                                id: magicFunction.createBoxParticleFromSource,
                                                modifier: {
                                                    size: 0.4,
                                                    duration: 10,
                                                    height: 5,
                                                    r: 1,
                                                    g: 0.16,
                                                    b: 0.01,
                                                    a: 1
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "ice_sculpture": {
        name: "Ice Sculpture",
        path: "textures/ui/magic_list/ice_sculpture",
        attribute: [ "creation", "nature" ],
        grade: "advance",
        type: "summon",
        cast_duration: 16,
        soul_cost: 43,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "ice_sculpture",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "nature_magic",
                                    multiply: -10,
                                    additive: 500
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.summonAtLocation,
                    modifier: {
                        type: "amw:ice_sculpture",
                        despawn: 560,
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.copyEquipment,
                                        modifier: {
                                            from: "actor",
                                            to: "self"
                                        }
                                    },
                                    {
                                        id: magicFunction.changeNameTag,
                                        modifier: {
                                            name: "{NAME}"
                                        }
                                    },
                                    {
                                        id: magicFunction.createBoxParticleFromSource,
                                        modifier: {
                                            size: 1,
                                            duration: 7,
                                            height: 5,
                                            r: 0.3,
                                            g: 0.8,
                                            b: 1,
                                            a: 1
                                        }
                                    },
                                    {
                                        id: magicFunction.createBoxParticleFromSource,
                                        modifier: {
                                            size: 0.9,
                                            duration: 8,
                                            height: 5,
                                            r: 0.3,
                                            g: 0.8,
                                            b: 1,
                                            a: 1
                                        }
                                    },
                                    {
                                        id: magicFunction.createBoxParticleFromSource,
                                        modifier: {
                                            size: 0.7,
                                            duration: 9,
                                            height: 5,
                                            r: 0.3,
                                            g: 0.8,
                                            b: 1,
                                            a: 1
                                        }
                                    },
                                    {
                                        id: magicFunction.createBoxParticleFromSource,
                                        modifier: {
                                            size: 0.4,
                                            duration: 10,
                                            height: 5,
                                            r: 0.3,
                                            g: 0.8,
                                            b: 1,
                                            a: 1
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    id: magicFunction.setKnockbackToTarget,
                    modifier: {
                        target: "view",
                        strength: 2,
                        inverse: true
                    }
                }
            ]
        },
        description: "Create an ice sclupture of yourself to bait an enemy."
    },
    "light_judgement": {
        name: "Light Judgement",
        path: "textures/ui/magic_list/light_judgement",
        attribute: [ "transmutation", "light" ],
        grade: "advance",
        type: "create",
        cast_duration: 32,
        soul_cost: 44,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<light_orb>",
            power: 0.9,
            duration: 20,
            impact: {
                id: magicFunction.burstCast,
                modifier: {
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "light_magic",
                                multiply: 20,
                                additive: 150
                            }
                        ]
                    },
                    delay: 3,
                    enable_cooldown: false,
                    spell: {
                        id: magicFunction.castRandomSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.castMultipleLocation,
                                    modifier: {
                                        formation: [
                                            [ "O", "X", "O" ],
                                            [ "X", "O", "X" ],
                                            [ "O", "X", "O" ]
                                        ],
                                        gap: Math.random()*6+3,
                                        ancor: [ 2, 2 ],
                                        focus: { x: Math.random()*3-1.5, y: -Math.random()*6-8, z: Math.random()*3-1.5 },
                                        offset: { x: 0, y: Math.random()*6+4, z: 0 },
                                        impact: {
                                            id: magicFunction.castRandomRotatedSpell,
                                            modifier: {
                                                strength: 0.1,
                                                head_location: true,
                                                spell: {
                                                    id: magicFunction.castSpellAtView,
                                                    modifier: {
                                                        range: 64,
                                                        impact: {
                                                            id: magicFunction.burstCast,
                                                            modifier: {
                                                                duration: 5,
                                                                delay: 0,
                                                                spell: {
                                                                    id: magicFunction.lightBeam,
                                                                    modifier: {
                                                                        strength: 5
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.castMultipleLocation,
                                    modifier: {
                                        formation: [
                                            [ "X", "O", "X" ],
                                            [ "O", "O", "O" ],
                                            [ "X", "O", "X" ]
                                        ],
                                        gap: Math.random()*6+3,
                                        ancor: [ 2, 2 ],
                                        focus: { x: Math.random()*3-1.5, y: -Math.random()*6-8, z: Math.random()*3-1.5 },
                                        offset: { x: 0, y: Math.random()*6+4, z: 0 },
                                        impact: {
                                            id: magicFunction.castRandomRotatedSpell,
                                            modifier: {
                                                strength: 0.1,
                                                head_location: true,
                                                spell: {
                                                    id: magicFunction.castSpellAtView,
                                                    modifier: {
                                                        range: 64,
                                                        impact: {
                                                            id: magicFunction.burstCast,
                                                            modifier: {
                                                                duration: 5,
                                                                delay: 0,
                                                                spell: {
                                                                    id: magicFunction.lightBeam,
                                                                    modifier: {
                                                                        strength: 5
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.castMultipleLocation,
                                    modifier: {
                                        formation: [
                                            [ "O", "X", "O" ],
                                            [ "X", "O", "X" ],
                                            [ "O", "X", "O" ]
                                        ],
                                        gap: Math.random()*6+3,
                                        ancor: [ 2, 2 ],
                                        focus: { x: Math.random()*3-1.5, y: -Math.random()*6-8, z: Math.random()*3-1.5 },
                                        offset: { x: 0, y: Math.random()*6+4, z: 0 },
                                        impact: {
                                            id: magicFunction.castRandomRotatedSpell,
                                            modifier: {
                                                strength: 0.1,
                                                head_location: true,
                                                spell: {
                                                    id: magicFunction.castSpellAtView,
                                                    modifier: {
                                                        range: 64,
                                                        impact: {
                                                            id: magicFunction.burstCast,
                                                            modifier: {
                                                                duration: 5,
                                                                delay: 0,
                                                                spell: {
                                                                    id: magicFunction.lightBeam,
                                                                    modifier: {
                                                                        strength: 5
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.castMultipleLocation,
                                    modifier: {
                                        formation: [
                                            [ "X", "O", "X" ],
                                            [ "O", "O", "O" ],
                                            [ "X", "O", "X" ]
                                        ],
                                        gap: Math.random()*6+3,
                                        ancor: [ 2, 2 ],
                                        focus: { x: Math.random()*3-1.5, y: -Math.random()*6-8, z: Math.random()*3-1.5 },
                                        offset: { x: 0, y: Math.random()*6+4, z: 0 },
                                        impact: {
                                            id: magicFunction.castRandomRotatedSpell,
                                            modifier: {
                                                strength: 0.1,
                                                head_location: true,
                                                spell: {
                                                    id: magicFunction.castSpellAtView,
                                                    modifier: {
                                                        range: 64,
                                                        impact: {
                                                            id: magicFunction.burstCast,
                                                            modifier: {
                                                                duration: 5,
                                                                delay: 0,
                                                                spell: {
                                                                    id: magicFunction.lightBeam,
                                                                    modifier: {
                                                                        strength: 5
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.castMultipleLocation,
                                    modifier: {
                                        formation: [
                                            [ "O", "X", "O" ],
                                            [ "X", "O", "X" ],
                                            [ "O", "X", "O" ]
                                        ],
                                        gap: Math.random()*6+3,
                                        ancor: [ 2, 2 ],
                                        focus: { x: Math.random()*3-1.5, y: -Math.random()*6-8, z: Math.random()*3-1.5 },
                                        offset: { x: 0, y: Math.random()*6+4, z: 0 },
                                        impact: {
                                            id: magicFunction.castRandomRotatedSpell,
                                            modifier: {
                                                strength: 0.1,
                                                head_location: true,
                                                spell: {
                                                    id: magicFunction.castSpellAtView,
                                                    modifier: {
                                                        range: 64,
                                                        impact: {
                                                            id: magicFunction.burstCast,
                                                            modifier: {
                                                                duration: 5,
                                                                delay: 0,
                                                                spell: {
                                                                    id: magicFunction.lightBeam,
                                                                    modifier: {
                                                                        strength: 5
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.castMultipleLocation,
                                    modifier: {
                                        formation: [
                                            [ "X", "O", "X" ],
                                            [ "O", "O", "O" ],
                                            [ "X", "O", "X" ]
                                        ],
                                        gap: Math.random()*6+3,
                                        ancor: [ 2, 2 ],
                                        focus: { x: Math.random()*3-1.5, y: -Math.random()*6-8, z: Math.random()*3-1.5 },
                                        offset: { x: 0, y: Math.random()*6+4, z: 0 },
                                        impact: {
                                            id: magicFunction.castRandomRotatedSpell,
                                            modifier: {
                                                strength: 0.1,
                                                head_location: true,
                                                spell: {
                                                    id: magicFunction.castSpellAtView,
                                                    modifier: {
                                                        range: 64,
                                                        impact: {
                                                            id: magicFunction.burstCast,
                                                            modifier: {
                                                                duration: 5,
                                                                delay: 0,
                                                                spell: {
                                                                    id: magicFunction.lightBeam,
                                                                    modifier: {
                                                                        strength: 5
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Create a random burst of light at target location for 20.5 seconds."
    },
    "possesion": {
        name: "Possesion",
        path: "textures/ui/magic_list/possesion",
        attribute: [ "conjuration", "dark" ],
        grade: "expert",
        type: "curse",
        cast_duration: 10,
        soul_cost: 8,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<dark_orb>",
            power: 0.85,
            duration: 1000,
            impact: {
                id: magicFunction.distanceTarget,
                modifier: {
                    distance: 2,
                    single_scan: true,
                    impact: {
                        id: magicFunction.burstCast,
                        modifier: {
                            duration: {
                                magic_attributes: [
                                    {
                                        magic_type: "dark_magic",
                                        multiply: 60,
                                        additive: 600
                                    }
                                ]
                            },
                            delay: 0,
                            enable_cooldown: true,
                            spell: {
                                id: magicFunction.possesion,
                                modifier: {
                                    controller: "actor"
                                }
                            },
                            stop_spell: {
                                id: magicFunction.stopPossesion,
                                modifier: {
                                    controller: "actor"
                                }
                            }
                        }
                    }
                }
            }
        },
        description: "Posses a target for 35 seconds."
    },
    "telekenesis": {
        name: "Telekenesis",
        path: "textures/ui/magic_list/telekenesis",
        attribute: [ "conjuration", "void" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "void_magic",
                        multiply: 20,
                        additive: 200
                    }
                ]
            },
            delay: 2,
            enable_cooldown: true,
            spell: {
                id: magicFunction.castSpellAtView,
                modifier: {
                    range: {
                        magic_attributes: [
                            {
                                magic_type: "void_magic",
                                multiply: 8,
                                additive: 16
                            }
                        ]
                    },
                    impact: {
                        id: magicFunction.distanceTarget,
                        modifier: {
                            distance: 1,
                            single_scan: true,
                            include_source: true,
                            impact: {
                                id: magicFunction.setKnockbackToTarget,
                                modifier: {
                                    target: "actor"
                                }
                            }
                        }
                    }
                }
            }
        },
        description: "Pull target to your location."
    },
    "atomic_hole": {
        name: "Atomic Hole",
        path: "textures/ui/magic_list/atomic_hole",
        attribute: [ "creation", "void" ],
        grade: "master",
        type: "create",
        cast_duration: 55,
        soul_cost: 77,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "atomic_hole",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "void_magic",
                                    multiply: -60,
                                    additive: 1200
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 72,
                        impact: {
                            id: magicFunction.summonAtLocation,
                            modifier: {
                                type: "amw:atomic_hole",
                                source_target: "summon",
                                spell: {
                                    id: magicFunction.burstCast,
                                    modifier: {
                                        duration: 200,
                                        delay: 5,
                                        enable_cooldown: true,
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "void_magic",
                                                                        multiply: 6,
                                                                        additive: 48
                                                                    }
                                                                ]
                                                            },
                                                            deadzone: 2,
                                                            impact: {
                                                                id: magicFunction.setKnockbackToTarget,
                                                                modifier: {
                                                                    target: "source"
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.setCameraShake,
                                                        modifier: {
                                                            radius: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "void_magic",
                                                                        multiply: 5,
                                                                        additive: 32
                                                                    }
                                                                ]
                                                            },
                                                            duration: 5,
                                                            strength: 0.1
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        stop_spell: {
                                            id: magicFunction.sequenceCast,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.createCircleBlastFromSource,
                                                        modifier: {
                                                            r: 0.15,
                                                            g: 0.1,
                                                            b: 0.2,
                                                            a: 1,
                                                            size: 12,
                                                            duration: 0.5
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.setCameraShake,
                                                        modifier: {
                                                            radius: 48,
                                                            duration: 60,
                                                            strength: 0.6
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 32,
                                                            deadzone: 2,
                                                            impact: {
                                                                id: magicFunction.setKnockbackToTarget,
                                                                modifier: {
                                                                    target: "source",
                                                                    inverse: true,
                                                                    strength: {
                                                                        magic_attributes: [
                                                                            {
                                                                                magic_type: "void_magic",
                                                                                multiply: 0.5,
                                                                                additive: 3
                                                                            }
                                                                        ]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.explosion,
                                                        modifier: {
                                                            radius: 8,
                                                            break: true
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.despawnTarget,
                                                        modifier: {
                                                            target: "self"
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                }
            ]
        },
        description: "Create an atomic hole at target location that can pull all entities for 10 second and explode in the end."
    },
    "atomic_destruction": {
        name: "Atomic Destruction",
        path: "textures/ui/magic_list/atomic_destruction",
        attribute: [ "creation", "void", "destruction" ],
        grade: "master",
        type: "create",
        cast_duration: 65,
        soul_cost: 86,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "atomic_destruction",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "void_magic",
                                    multiply: -10,
                                    additive: 600
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 72,
                        impact: {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "X" ]
                                ],
                                gap: 1,
                                ancor: [ 1, 1 ],
                                focus: { x: 0, y: -1, z: 0 },
                                offset: { x: 0, y: 16, z: 0 },
                                impact: {
                                    id: magicFunction.castSpellOrb,
                                    modifier: {
                                        type: "amw:atomic_hole",
                                        power: 0.045,
                                        duration: 300,
                                        impact: {
                                            id: magicFunction.sequenceCast,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.createCircleBlastFromSource,
                                                        modifier: {
                                                            r: 0.15,
                                                            g: 0.1,
                                                            b: 0.2,
                                                            a: 1,
                                                            size: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "void_magic",
                                                                        multiply: 2,
                                                                        additive: 16
                                                                    }
                                                                ]
                                                            },
                                                            duration: 0.3
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.explosion,
                                                        modifier: {
                                                            radius: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "void_magic",
                                                                        multiply: 4,
                                                                        additive: 32
                                                                    }
                                                                ]
                                                            },
                                                            break: true,
                                                            underwater: true,
                                                            fire: true
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "fireball": {
        name: "Fireball",
        path: "textures/ui/magic_list/fireball",
        attribute: [ "transmutation", "fire" ],
        grade: "basic",
        type: "create",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_fireball",
            power: 0.9
        },
        description: "Conjure a fireball."
    },
    "water_bomb": {
        name: "Water Bomb",
        path: "textures/ui/magic_list/water_bomb",
        attribute: [ "transmutation", "water" ],
        grade: "basic",
        type: "create",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_orb<water_orb>",
            power: 0.9,
            spell: {
                id: magicFunction.projectileHitCast,
                modifier: {
                    impact: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.createParticle,
                                    modifier: {
                                        particle: "magic:water_bomb",
                                        data: [
                                            {
                                                name: "scatter",
                                                data: 1.5
                                            },
                                            {
                                                name: "lifetime",
                                                data: 1
                                            },
                                            {
                                                name: "explosion",
                                                data: 4
                                            },
                                            {
                                                name: "direction",
                                                data: {
                                                    x: 0.2,
                                                    y: 1,
                                                    z: 0.2
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 6,
                                        include_source: true,
                                        impact: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.setKnockbackToTarget,
                                                        modifier: {
                                                            target: "source",
                                                            inverse: true,
                                                            strength: 1.5,
                                                            offset: {
                                                                x: 0, y: -1, z: 0
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.damageToSource,
                                                        modifier: {
                                                            strength: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "water_magic",
                                                                        multiply: 1,
                                                                        additive: 1
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: ""
    },
    "ice_bounce": {
        name: "Ice Bounce",
        path: "textures/ui/magic_list/ice_bounce",
        attribute: [ "transmutation", "ice" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_icicle<absolute>",
            power: 0.5,
            despawn: 600,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.setBounceProjectile,
                            modifier: {
                                max_step: 3
                            }
                        },
                        {
                            id: magicFunction.projectileHitCast,
                            modifier: {
                                max_step: 4,
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "amw:ice_spike",
                                        despawn: 60,
                                        copy_rotation: false,
                                        spell: {
                                            id: magicFunction.distanceTarget,
                                            modifier: {
                                                distance: 4,
                                                impact: {
                                                    id: magicFunction.setFreeze,
                                                    modifier: {
                                                        type: "stunt",
                                                        duration: {
                                                            magic_attributes: [
                                                                {
                                                                    magic_type: "ice_magic",
                                                                    multiply: 90,
                                                                    additive: 60
                                                                }
                                                            ]
                                                        },
                                                        strength: {
                                                            to_int: true,
                                                            magic_attributes: [
                                                                {
                                                                    magic_type: "ice_magic",
                                                                    multiply: 0.5,
                                                                    additive: 1
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "icicle": {
        name: "Icicle",
        path: "textures/ui/magic_list/icicle",
        attribute: [ "transmutation", "ice" ],
        grade: "basic",
        type: "create",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_icicle",
            power: 1.4,
            spell: {
                id: magicFunction.projectileHitCast,
                modifier: {
                    impact: {
                        id: magicFunction.summonAtFloor,
                        modifier: {
                            type: "amw:ice_spike",
                            despawn: 60,
                            copy_rotation: false,
                            spell: {
                                id: magicFunction.distanceTarget,
                                modifier: {
                                    distance: 4,
                                    impact: {
                                        id: magicFunction.setFreeze,
                                        modifier: {
                                            type: "stunt",
                                            duration: {
                                                magic_attributes: [
                                                    {
                                                        magic_type: "ice_magic",
                                                        multiply: 90,
                                                        additive: 60
                                                    }
                                                ]
                                            },
                                            strength: {
                                                to_int: true,
                                                magic_attributes: [
                                                    {
                                                        magic_type: "ice_magic",
                                                        multiply: 0.5,
                                                        additive: 1
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: ""
    },
    "icicle_bomb": {
        name: "Icicle Bomb",
        path: "textures/ui/magic_list/icicle_bomb",
        attribute: [ "transmutation", "ice" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_orb<hard_ice_orb>",
            power: 1.8,
            spell: {
                id: magicFunction.projectileHitCast,
                modifier: {
                    hit_type: "block",
                    impact: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.createSourceDummy,
                                    modifier: {
                                        spell: {
                                            id: magicFunction.castRotatedSpell,
                                            modifier: {
                                                degree: -25,
                                                distance: 0.1,
                                                axis: "x",
                                                reset_axis: "x",
                                                spell: {
                                                    id: magicFunction.castRotatedSpell,
                                                    modifier: {
                                                        count: {
                                                            magic_attributes: [
                                                                {
                                                                    magic_type: "ice_magic",
                                                                    multiply: 3,
                                                                    additive: 6
                                                                }
                                                            ]
                                                        },
                                                        degree: 360,
                                                        distance: 0.1,
                                                        axis: "y",
                                                        spell: {
                                                            id: magicFunction.castRandomRotatedSpell,
                                                            modifier: {
                                                                strength: 0.25,
                                                                spell: {
                                                                    id: magicFunction.castProjectile,
                                                                    modifier: {
                                                                        type: "amw:magic_icicle<absolute>",
                                                                        power: 1.1,
                                                                        despawn: 100,
                                                                        spell: {
                                                                            id: magicFunction.projectileHitCast,
                                                                            modifier: {
                                                                                hit_type: "entity",
                                                                                impact: {
                                                                                    id: magicFunction.setFreeze,
                                                                                    modifier: {
                                                                                        type: "slow",
                                                                                        duration: {
                                                                                            magic_attributes: [
                                                                                                {
                                                                                                    magic_type: "ice_magic",
                                                                                                    multiply: 40,
                                                                                                    additive: 20
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        strength: 1
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.despawnTarget,
                                    modifier: {}
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: ""
    },
    "burning_heals": {
        name: "Burning Heals",
        path: "textures/ui/magic_list/burning_heals",
        attribute: [ "transmutation", "restoration", "fire" ],
        grade: "advance",
        type: "create",
        cast_duration: 35,
        soul_cost: 24,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 72,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 8,
                                duration: 300,
                                height: 4,
                                r: 0.51,
                                g: 0.08,
                                b: 0.26,
                                a: 0.85
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 7.9,
                                duration: 300,
                                height: 3,
                                r: 0.95,
                                g: 0.8,
                                b: 0.38,
                                a: 0.6
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 7.7,
                                duration: 300,
                                height: 2,
                                r: 0.95,
                                g: 0.86,
                                b: 0.72,
                                a: 0.3
                            }
                        },
                        {
                            id: magicFunction.summonAtLocation,
                            modifier: {
                                type: "amw:fireflies_soul",
                                offset: {
                                    x: 0,
                                    y: 1.2,
                                    z: 0
                                },
                                despawn: 300,
                                spell: {
                                    id: magicFunction.burstCast,
                                    modifier:{
                                        duration: 200,
                                        delay: 7,
                                        spell: {
                                            id: magicFunction.floating,
                                            modifier: {
                                                strength: 0.01,
                                                height: 2
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 300,
                                delay: 4,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: { x: 8, y: 4, z: 8 },
                                                    offset: { x: 0, y: 2, z: 0 },
                                                    include_actor: true,
                                                    include_source: true,
                                                    exclude_families: [ "monster" ],
                                                    impact: {
                                                        id: magicFunction.healing,
                                                        modifier: {
                                                            strength: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "fire_magic",
                                                                        multiply: 0.2,
                                                                        additive: 0.6
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: { x: 8, y: 4, z: 8 },
                                                    offset: { x: 0, y: 2, z: 0 },
                                                    include_actor: true,
                                                    include_source: true,
                                                    impact: {
                                                        id: magicFunction.setFire,
                                                        modifier: {
                                                            strength: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "fire_magic",
                                                                        multiply: 1,
                                                                        additive: 1
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "fireflies_soul": {
        name: "Fireflies Soul",
        path: "textures/ui/magic_list/fireflies_soul",
        attribute: [ "creation", "fire" ],
        grade: "advance",
        type: "summon",
        cast_duration: 55,
        soul_cost: 37,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "fireflies_control",
                        restart_cluster: true,
                        duration: 200
                    }
                },
                {
                    id: magicFunction.castSpellOrb,
                    modifier: {
                        type: "amw:fireflies_soul",
                        power: 0.15,
                        duration: 100,
                        ongoing: {
                            id: magicFunction.distanceTarget,
                            modifier: {
                                distance: 5,
                                impact: {
                                    id: magicFunction.sourceTest,
                                    modifier: {
                                        on_fire: false,
                                        single_scan: {
                                            cluster_name: "fireflies_control"
                                        },
                                        spell: {
                                            id: magicFunction.sequenceCast,
                                            modifier: {
                                                delay: 10,
                                                spell: [
                                                    {
                                                        id: magicFunction.castMultipleSpell,
                                                        modifier: {
                                                            spell: [
                                                                {
                                                                    id: magicFunction.createCircleBlastFromSource,
                                                                    modifier: {
                                                                        r: 1,
                                                                        g: 0.4,
                                                                        b: 0,
                                                                        a: 0.5,
                                                                        size: 5,
                                                                        duration: 0.5,
                                                                        offset: {x: 0, y: 0.1, z: 0}
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.createParticle,
                                                                    modifier: {
                                                                        particle: "magic:fire_drip_effect"
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.setFire,
                                                                    modifier: {
                                                                        strength: 7
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.addSingleScan,
                                                                    modifier: {
                                                                        cluster_name: "fireflies_control",
                                                                        duration: 60
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.setKnockbackToTarget,
                                                                    modifier: {
                                                                        target: "self",
                                                                        offset: {
                                                                            x: 0,
                                                                            y: 0.1,
                                                                            z: 0
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.setCameraShake,
                                                                    modifier: {
                                                                        radius: 8,
                                                                        duration: 20,
                                                                        strength: 0.1
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 5,
                                                            impact: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    on_fire: false,
                                                                    single_scan: {
                                                                        cluster_name: "fireflies_control"
                                                                    },
                                                                    spell: {
                                                                        id: magicFunction.sequenceCast,
                                                                        modifier: {
                                                                            delay: 10,
                                                                            spell: [
                                                                                {
                                                                                    id: magicFunction.castMultipleSpell,
                                                                                    modifier: {
                                                                                        spell: [
                                                                                            {
                                                                                                id: magicFunction.createCircleBlastFromSource,
                                                                                                modifier: {
                                                                                                    r: 1,
                                                                                                    g: 0.4,
                                                                                                    b: 0,
                                                                                                    a: 0.5,
                                                                                                    size: 5,
                                                                                                    duration: 0.5,
                                                                                                    offset: {x: 0, y: 0.1, z: 0}
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                id: magicFunction.createParticle,
                                                                                                modifier: {
                                                                                                    particle: "magic:fire_drip_effect"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                id: magicFunction.setFire,
                                                                                                modifier: {
                                                                                                    strength: 6
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                id: magicFunction.addSingleScan,
                                                                                                modifier: {
                                                                                                    cluster_name: "fireflies_control",
                                                                                                    duration: 60
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                id: magicFunction.setKnockbackToTarget,
                                                                                                modifier: {
                                                                                                    target: "self",
                                                                                                    offset: {
                                                                                                        x: 0,
                                                                                                        y: 0.1,
                                                                                                        z: 0
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                id: magicFunction.setCameraShake,
                                                                                                modifier: {
                                                                                                    radius: 8,
                                                                                                    duration: 20,
                                                                                                    strength: 0.1
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                {
                                                                                    id: magicFunction.distanceTarget,
                                                                                    modifier: {
                                                                                        distance: 5,
                                                                                        impact: {
                                                                                            id: magicFunction.sourceTest,
                                                                                            modifier: {
                                                                                                on_fire: false,
                                                                                                single_scan: {
                                                                                                    cluster_name: "fireflies_control"
                                                                                                },
                                                                                                spell: {
                                                                                                    id: magicFunction.sequenceCast,
                                                                                                    modifier: {
                                                                                                        delay: 10,
                                                                                                        spell: [
                                                                                                            {
                                                                                                                id: magicFunction.castMultipleSpell,
                                                                                                                modifier: {
                                                                                                                    spell: [
                                                                                                                        {
                                                                                                                            id: magicFunction.createCircleBlastFromSource,
                                                                                                                            modifier: {
                                                                                                                                r: 1,
                                                                                                                                g: 0.4,
                                                                                                                                b: 0,
                                                                                                                                a: 0.5,
                                                                                                                                size: 5,
                                                                                                                                duration: 0.5,
                                                                                                                                offset: {x: 0, y: 0.1, z: 0}
                                                                                                                            }
                                                                                                                        },
                                                                                                                        {
                                                                                                                            id: magicFunction.createParticle,
                                                                                                                            modifier: {
                                                                                                                                particle: "magic:fire_drip_effect"
                                                                                                                            }
                                                                                                                        },
                                                                                                                        {
                                                                                                                            id: magicFunction.setFire,
                                                                                                                            modifier: {
                                                                                                                                strength: 5
                                                                                                                            }
                                                                                                                        },
                                                                                                                        {
                                                                                                                            id: magicFunction.addSingleScan,
                                                                                                                            modifier: {
                                                                                                                                cluster_name: "fireflies_control",
                                                                                                                                duration: 60
                                                                                                                            }
                                                                                                                        },
                                                                                                                        {
                                                                                                                            id: magicFunction.setKnockbackToTarget,
                                                                                                                            modifier: {
                                                                                                                                target: "self",
                                                                                                                                offset: {
                                                                                                                                    x: 0,
                                                                                                                                    y: 0.1,
                                                                                                                                    z: 0
                                                                                                                                }
                                                                                                                            }
                                                                                                                        },
                                                                                                                        {
                                                                                                                            id: magicFunction.setCameraShake,
                                                                                                                            modifier: {
                                                                                                                                radius: 8,
                                                                                                                                duration: 20,
                                                                                                                                strength: 0.1
                                                                                                                            }
                                                                                                                        }
                                                                                                                    ]
                                                                                                                }
                                                                                                            },
                                                                                                            {
                                                                                                                id: magicFunction.distanceTarget,
                                                                                                                modifier: {
                                                                                                                    distance: 5,
                                                                                                                    impact: {
                                                                                                                        id: magicFunction.sourceTest,
                                                                                                                        modifier: {
                                                                                                                            on_fire: false,
                                                                                                                            single_scan: {
                                                                                                                                cluster_name: "fireflies_control"
                                                                                                                            },
                                                                                                                            spell: {
                                                                                                                                id: magicFunction.sequenceCast,
                                                                                                                                modifier: {
                                                                                                                                    delay: 10,
                                                                                                                                    spell: [
                                                                                                                                        {
                                                                                                                                            id: magicFunction.castMultipleSpell,
                                                                                                                                            modifier: {
                                                                                                                                                spell: [
                                                                                                                                                    {
                                                                                                                                                        id: magicFunction.createCircleBlastFromSource,
                                                                                                                                                        modifier: {
                                                                                                                                                            r: 1,
                                                                                                                                                            g: 0.4,
                                                                                                                                                            b: 0,
                                                                                                                                                            a: 0.5,
                                                                                                                                                            size: 5,
                                                                                                                                                            duration: 0.5,
                                                                                                                                                            offset: {x: 0, y: 0.1, z: 0}
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        id: magicFunction.createParticle,
                                                                                                                                                        modifier: {
                                                                                                                                                            particle: "magic:fire_drip_effect"
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        id: magicFunction.setFire,
                                                                                                                                                        modifier: {
                                                                                                                                                            strength: 4
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        id: magicFunction.addSingleScan,
                                                                                                                                                        modifier: {
                                                                                                                                                            cluster_name: "fireflies_control",
                                                                                                                                                            duration: 60
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        id: magicFunction.setKnockbackToTarget,
                                                                                                                                                        modifier: {
                                                                                                                                                            target: "self",
                                                                                                                                                            offset: {
                                                                                                                                                                x: 0,
                                                                                                                                                                y: 0.1,
                                                                                                                                                                z: 0
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    },
                                                                                                                                                    {
                                                                                                                                                        id: magicFunction.setCameraShake,
                                                                                                                                                        modifier: {
                                                                                                                                                            radius: 8,
                                                                                                                                                            duration: 20,
                                                                                                                                                            strength: 0.1
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                ]
                                                                                                                                            }
                                                                                                                                        },
                                                                                                                                        {
                                                                                                                                            id: magicFunction.distanceTarget,
                                                                                                                                            modifier: {
                                                                                                                                                distance: 5,
                                                                                                                                                impact: {
                                                                                                                                                    id: magicFunction.sourceTest,
                                                                                                                                                    modifier: {
                                                                                                                                                        on_fire: false,
                                                                                                                                                        single_scan: {
                                                                                                                                                            cluster_name: "fireflies_control"
                                                                                                                                                        },
                                                                                                                                                        spell: {
                                                                                                                                                            id: magicFunction.sequenceCast,
                                                                                                                                                            modifier: {
                                                                                                                                                                delay: 10,
                                                                                                                                                                spell: [
                                                                                                                                                                    {
                                                                                                                                                                        id: magicFunction.castMultipleSpell,
                                                                                                                                                                        modifier: {
                                                                                                                                                                            spell: [
                                                                                                                                                                                {
                                                                                                                                                                                    id: magicFunction.createCircleBlastFromSource,
                                                                                                                                                                                    modifier: {
                                                                                                                                                                                        r: 1,
                                                                                                                                                                                        g: 0.4,
                                                                                                                                                                                        b: 0,
                                                                                                                                                                                        a: 0.5,
                                                                                                                                                                                        size: 5,
                                                                                                                                                                                        duration: 0.5,
                                                                                                                                                                                        offset: {x: 0, y: 0.1, z: 0}
                                                                                                                                                                                    }
                                                                                                                                                                                },
                                                                                                                                                                                {
                                                                                                                                                                                    id: magicFunction.createParticle,
                                                                                                                                                                                    modifier: {
                                                                                                                                                                                        particle: "magic:fire_drip_effect"
                                                                                                                                                                                    }
                                                                                                                                                                                },
                                                                                                                                                                                {
                                                                                                                                                                                    id: magicFunction.setFire,
                                                                                                                                                                                    modifier: {
                                                                                                                                                                                        strength: 3
                                                                                                                                                                                    }
                                                                                                                                                                                },
                                                                                                                                                                                {
                                                                                                                                                                                    id: magicFunction.addSingleScan,
                                                                                                                                                                                    modifier: {
                                                                                                                                                                                        cluster_name: "fireflies_control",
                                                                                                                                                                                        duration: 60
                                                                                                                                                                                    }
                                                                                                                                                                                },
                                                                                                                                                                                {
                                                                                                                                                                                    id: magicFunction.setKnockbackToTarget,
                                                                                                                                                                                    modifier: {
                                                                                                                                                                                        target: "self",
                                                                                                                                                                                        offset: {
                                                                                                                                                                                            x: 0,
                                                                                                                                                                                            y: 0.1,
                                                                                                                                                                                            z: 0
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                },
                                                                                                                                                                                {
                                                                                                                                                                                    id: magicFunction.setCameraShake,
                                                                                                                                                                                    modifier: {
                                                                                                                                                                                        radius: 8,
                                                                                                                                                                                        duration: 20,
                                                                                                                                                                                        strength: 0.1
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            ]
                                                                                                                                                                        }
                                                                                                                                                                    },
                                                                                                                                                                    {
                                                                                                                                                                        id: magicFunction.distanceTarget,
                                                                                                                                                                        modifier: {
                                                                                                                                                                            distance: 5,
                                                                                                                                                                            impact: {
                                                                                                                                                                                id: magicFunction.sourceTest,
                                                                                                                                                                                modifier: {
                                                                                                                                                                                    on_fire: false,
                                                                                                                                                                                    single_scan: {
                                                                                                                                                                                        cluster_name: "fireflies_control"
                                                                                                                                                                                    },
                                                                                                                                                                                    spell: {
                                                                                                                                                                                        id: magicFunction.sequenceCast,
                                                                                                                                                                                        modifier: {
                                                                                                                                                                                            delay: 10,
                                                                                                                                                                                            spell: [
                                                                                                                                                                                                {
                                                                                                                                                                                                    id: magicFunction.castMultipleSpell,
                                                                                                                                                                                                    modifier: {
                                                                                                                                                                                                        spell: [
                                                                                                                                                                                                            {
                                                                                                                                                                                                                id: magicFunction.createCircleBlastFromSource,
                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                    r: 1,
                                                                                                                                                                                                                    g: 0.4,
                                                                                                                                                                                                                    b: 0,
                                                                                                                                                                                                                    a: 0.5,
                                                                                                                                                                                                                    size: 5,
                                                                                                                                                                                                                    duration: 0.5,
                                                                                                                                                                                                                    offset: {x: 0, y: 0.1, z: 0}
                                                                                                                                                                                                                }
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                id: magicFunction.createParticle,
                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                    particle: "magic:fire_drip_effect"
                                                                                                                                                                                                                }
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                id: magicFunction.setFire,
                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                    strength: 2
                                                                                                                                                                                                                }
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                id: magicFunction.addSingleScan,
                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                    cluster_name: "fireflies_control",
                                                                                                                                                                                                                    duration: 60
                                                                                                                                                                                                                }
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                id: magicFunction.setKnockbackToTarget,
                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                    target: "self",
                                                                                                                                                                                                                    offset: {
                                                                                                                                                                                                                        x: 0,
                                                                                                                                                                                                                        y: 0.1,
                                                                                                                                                                                                                        z: 0
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            },
                                                                                                                                                                                                            {
                                                                                                                                                                                                                id: magicFunction.setCameraShake,
                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                    radius: 8,
                                                                                                                                                                                                                    duration: 20,
                                                                                                                                                                                                                    strength: 0.1
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        ]
                                                                                                                                                                                                    }
                                                                                                                                                                                                },
                                                                                                                                                                                                {
                                                                                                                                                                                                    id: magicFunction.distanceTarget,
                                                                                                                                                                                                    modifier: {
                                                                                                                                                                                                        distance: 5,
                                                                                                                                                                                                        impact: {
                                                                                                                                                                                                            id: magicFunction.sourceTest,
                                                                                                                                                                                                            modifier: {
                                                                                                                                                                                                                on_fire: false,
                                                                                                                                                                                                                single_scan: {
                                                                                                                                                                                                                    cluster_name: "fireflies_control"
                                                                                                                                                                                                                },
                                                                                                                                                                                                                spell: {
                                                                                                                                                                                                                    id: magicFunction.castMultipleSpell,
                                                                                                                                                                                                                    modifier: {
                                                                                                                                                                                                                        spell: [
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                id: magicFunction.createCircleBlastFromSource,
                                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                                    r: 1,
                                                                                                                                                                                                                                    g: 0.4,
                                                                                                                                                                                                                                    b: 0,
                                                                                                                                                                                                                                    a: 0.5,
                                                                                                                                                                                                                                    size: 5,
                                                                                                                                                                                                                                    duration: 0.5,
                                                                                                                                                                                                                                    offset: {x: 0, y: 0.1, z: 0}
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                id: magicFunction.createParticle,
                                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                                    particle: "magic:fire_drip_effect"
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                id: magicFunction.setFire,
                                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                                    strength: 1
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                id: magicFunction.addSingleScan,
                                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                                    cluster_name: "fireflies_control",
                                                                                                                                                                                                                                    duration: 60
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                id: magicFunction.setKnockbackToTarget,
                                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                                    target: "self",
                                                                                                                                                                                                                                    offset: {
                                                                                                                                                                                                                                        x: 0,
                                                                                                                                                                                                                                        y: 0.1,
                                                                                                                                                                                                                                        z: 0
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            },
                                                                                                                                                                                                                            {
                                                                                                                                                                                                                                id: magicFunction.setCameraShake,
                                                                                                                                                                                                                                modifier: {
                                                                                                                                                                                                                                    radius: 8,
                                                                                                                                                                                                                                    duration: 20,
                                                                                                                                                                                                                                    strength: 0.1
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        ]
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            ]
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                ]
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    ]
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Summon a fireflies soul that can burn a targat and spread to nearby entities."
    },
    "fire_bullet": {
        name: "Fire Bullet",
        path: "textures/ui/magic_list/fire_bullet",
        attribute: [ "transmutation", "fire" ],
        grade: "basic",
        type: "create",
        cast_duration: 10,
        soul_cost: 8,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<fire_orb>",
            power: {
                magic_attributes: [
                    {
                        magic_type: "fire_magic",
                        multiply: 0.2,
                        additive: 0.3
                    }
                ]
            },
            duration: 200,
            particles: "magic:fireball_effect",
            impact: {
                id: magicFunction.distanceTarget,
                particles: "magic:fire_impact",
                modifier: {
                    distance: {
                        magic_attributes: [
                            {
                                magic_type: "fire_magic",
                                multiply: 0.1,
                                additive: 2
                            }
                        ]
                    },
                    impact: {
                        id: magicFunction.setFire,
                        modifier: {
                            strength: {
                                magic_attributes: [
                                    {
                                        magic_type: "fire_magic",
                                        multiply: 1,
                                        additive: 2
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        description: "Create a magic orb that can cause the target burn."
    },
    "bubble_trap": {
        name: "Bubble Trap",
        path: "textures/ui/magic_list/bubble_trap",
        attribute: [ "transmutation", "water" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 10,
        soul_cost: 13,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<water_orb>",
            power: {
                magic_attributes: [
                    {
                        magic_type: "water_magic",
                        multiply: 0.1,
                        additive: 0.6
                    }
                ]
            },
            duration: 200,
            particles: "minecraft:water_splash_particle_manual",
            impact: {
                id: magicFunction.distanceTarget,
                modifier: {
                    distance: 2,
                    include_source: true,
                    impact: {
                        id: magicFunction.bubbleTrap,
                        modifier: {
                            duration: {
                                magic_attributes: [
                                    {
                                        magic_type: "water_magic",
                                        multiply: 15,
                                        additive: 200
                                    }
                                ]
                            }
                        }
                    }
                }
            }
        },
        description: "Create a bubble trap to target location. Bubble trap can make target floating for 10 seconds."
    },
    "water_pudding": {
        name: "Water Pudding",
        path: "textures/ui/magic_list/water_pudding",
        attribute: [ "transmutation", "water" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 8,
        soul_cost: 16,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 72,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.summonAtLocation,
                            modifier: {
                                type: "amw:bubble_trap",
                                offset: {
                                    x: 0,
                                    y: 1.5,
                                    z: 0
                                },
                                despawn: {
                                    magic_attributes: [
                                        {
                                            magic_type: "water_magic",
                                            multiply: 20,
                                            additive: 300
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "water_magic",
                                            multiply: 20,
                                            additive: 300
                                        }
                                    ]
                                },
                                delay: 2,
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: {
                                            x: 3,
                                            y: 3,
                                            z: 3
                                        },
                                        include_actor: true,
                                        include_source: true,
                                        offset: {
                                            x: 0,
                                            y: 1.5,
                                            z: 0
                                        },
                                        impact: {
                                            id: magicFunction.bouncingMovement,
                                            modifier: {
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Create a bubble trap to target location. Bubble trap can make target floating for 10 seconds."
    },
    "toxic_flood": {
        name: "Toxic Flood",
        path: "textures/ui/magic_list/toxic_flood",
        attribute: [ "transmutation", "destruction", "dark", "water" ],
        grade: "advance",
        type: "curse",
        cast_duration: 18,
        soul_cost: 26,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb_dummy",
            deadzone: 2,
            power: 0.75,
            duration: 30,
            ongoing: {
                id: magicFunction.summonAtFloor,
                delay: 3,
                modifier: {
                    type: "amw:magic_orb_dummy",
                    spell: {
                        id: magicFunction.createSourceDummy,
                        modifier: {
                            spell: {
                                id: magicFunction.castMultipleSpell,
                                modifier: {
                                    spell: [
                                        {
                                            id: magicFunction.createParticle,
                                            modifier: {
                                                particle: "magic:floor_smoke",
                                                data: [
                                                    {
                                                        name: "color",
                                                        data: {
                                                            red: 0.4,
                                                            green: 0.84,
                                                            blue: 0.45
                                                        }
                                                    },
                                                    {
                                                        name: "modifier",
                                                        data: {
                                                            x: 4,
                                                            y: 40,
                                                            z: 2
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            id: magicFunction.burstCast,
                                            modifier: {
                                                duration: 600,
                                                delay: 20,
                                                spell: {
                                                    id: magicFunction.distanceTarget,
                                                    modifier: {
                                                        distance: 4,
                                                        impact: {
                                                            id: magicFunction.toxicEffect,
                                                            modifier: {
                                                                strength: {
                                                                    to_int: true,
                                                                    magic_attributes: [
                                                                        {
                                                                            magic_type: "water_magic",
                                                                            multiply: 1,
                                                                            additive: 0
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        description: ""
    },
    "toxic_step": {
        name: "Toxic Step",
        path: "textures/ui/magic_list/toxic_step",
        attribute: [ "transmutation", "destruction", "dark", "water" ],
        grade: "intermediate",
        type: "curse",
        cast_duration: 15,
        soul_cost: 30,
        function: magicFunction.burstCast,
        modifier: {
            enable_cooldown: true,
            duration: {
                magic_attributes: [
                    {
                        magic_type: "water_magic",
                        multiply: 20,
                        additive: 300
                    }
                ]
            },
            delay: 4,
            spell: {
                id: magicFunction.sourceTest,
                modifier: {
                    is_on_ground: true,
                    velocity: {
                        operator: ">",
                        value: 0.1
                    },
                    spell: {
                        id: magicFunction.createSourceDummy,
                        modifier: {
                            spell: {
                                id: magicFunction.castMultipleSpell,
                                modifier: {
                                    spell: [
                                        {
                                            id: magicFunction.createParticle,
                                            modifier: {
                                                particle: "magic:floor_smoke",
                                                data: [
                                                    {
                                                        name: "color",
                                                        data: {
                                                            red: 0.4,
                                                            green: 0.84,
                                                            blue: 0.45
                                                        }
                                                    },
                                                    {
                                                        name: "modifier",
                                                        data: {
                                                            x: 1,
                                                            y: 6,
                                                            z: 1
                                                        }
                                                    }
                                                ]
                                            }
                                        },
                                        {
                                            id: magicFunction.burstCast,
                                            modifier: {
                                                duration: 100,
                                                delay: 20,
                                                spell: {
                                                    id: magicFunction.distanceTarget,
                                                    modifier: {
                                                        distance: 2,
                                                        impact: {
                                                            id: magicFunction.toxicEffect,
                                                            modifier: {
                                                                strength: {
                                                                    to_int: true,
                                                                    magic_attributes: [
                                                                        {
                                                                            magic_type: "water_magic",
                                                                            multiply: 1,
                                                                            additive: 0
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        },
        description: ""
    },
    "tentacle_area": {
        name: "Tentacle Area",
        path: "textures/ui/magic_list/tentacle_area",
        attribute: [ "transmutation", "dark" ],
        grade: "advance",
        type: "curse",
        cast_duration: 28,
        soul_cost: 36,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 72,
            impact: {
                id: magicFunction.castRandomSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "X", "O" , "X" , "O" ],
                                    [ "O", "O", "O" , "O" , "X" ],
                                    [ "X", "O", "X" , "X" , "O" ],
                                    [ "O", "O", "O" , "O" , "X" ],
                                    [ "O", "X", "O" , "O" , "O" ]
                                ],
                                gap: Math.random()*2+1.5,
                                ancor: [ 2, 2 ],
                                focus: { x: 0, y: -1, z: 0 },
                                offset: { x: 0, y: 8, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "amw:tentacle",
                                        source_target: "summon",
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.castRandomLocationSpell,
                                                        modifier: {
                                                            size: { x: 4, y: 0, z: 4 },
                                                            offset: { x: 0, y: 6, z: 0 },
                                                            strength: 1,
                                                            spell: {
                                                                id: magicFunction.castAtFloor,
                                                                modifier: {
                                                                    spell: {
                                                                        id: magicFunction.createParticle,
                                                                        modifier: {
                                                                            particle: "magic:tentacle_shadow",
                                                                            data: [
                                                                                {
                                                                                    name: "duration",
                                                                                    data: 5
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.createParticle,
                                                        modifier: {
                                                            particle: "magic:floor_smoke",
                                                            data: [
                                                                {
                                                                    name: "color",
                                                                    data: {
                                                                        red: 0.35,
                                                                        green: 0.3,
                                                                        blue: 0.5
                                                                    }
                                                                },
                                                                {
                                                                    name: "modifier",
                                                                    data: {
                                                                        x: 5,
                                                                        y: 7,
                                                                        z: 3
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.burstCast,
                                                        modifier: {
                                                            duration: 120,
                                                            delay: 2,
                                                            spell: {
                                                                id: magicFunction.distanceTarget,
                                                                modifier: {
                                                                    distance: 4,
                                                                    include_source: false,
                                                                    offset: {
                                                                        x: 0,
                                                                        y: 0,
                                                                        z: 0
                                                                    },
                                                                    impact: {
                                                                        id: magicFunction.tentacleEffect,
                                                                        modifier: {
                                                                            strength: 2
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            stop_spell: {
                                                                id: magicFunction.despawnTarget,
                                                                modifier: {
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "X", "O" , "X" , "O" ],
                                    [ "O", "O", "X" , "O" , "X" ],
                                    [ "X", "O", "O" , "X" , "O" ],
                                    [ "O", "X", "O" , "O" , "O" ],
                                    [ "O", "O", "X" , "O" , "X" ]
                                ],
                                gap: Math.random()*2+1.5,
                                ancor: [ 2, 2 ],
                                focus: { x: 0, y: -1, z: 0 },
                                offset: { x: 0, y: 8, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "amw:tentacle",
                                        source_target: "summon",
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.castRandomLocationSpell,
                                                        modifier: {
                                                            size: { x: 4, y: 0, z: 4 },
                                                            offset: { x: 0, y: 6, z: 0 },
                                                            strength: 1,
                                                            spell: {
                                                                id: magicFunction.castAtFloor,
                                                                modifier: {
                                                                    spell: {
                                                                        id: magicFunction.createParticle,
                                                                        modifier: {
                                                                            particle: "magic:tentacle_shadow",
                                                                            data: [
                                                                                {
                                                                                    name: "duration",
                                                                                    data: 5
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.createParticle,
                                                        modifier: {
                                                            particle: "magic:floor_smoke",
                                                            data: [
                                                                {
                                                                    name: "color",
                                                                    data: {
                                                                        red: 0.35,
                                                                        green: 0.3,
                                                                        blue: 0.5
                                                                    }
                                                                },
                                                                {
                                                                    name: "modifier",
                                                                    data: {
                                                                        x: 5,
                                                                        y: 7,
                                                                        z: 3
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.burstCast,
                                                        modifier: {
                                                            duration: 120,
                                                            delay: 2,
                                                            spell: {
                                                                id: magicFunction.distanceTarget,
                                                                modifier: {
                                                                    distance: 4,
                                                                    include_source: false,
                                                                    offset: {
                                                                        x: 0,
                                                                        y: 0,
                                                                        z: 0
                                                                    },
                                                                    impact: {
                                                                        id: magicFunction.tentacleEffect,
                                                                        modifier: {
                                                                            strength: 2
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            stop_spell: {
                                                                id: magicFunction.despawnTarget,
                                                                modifier: {
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "X", "O" , "O" , "X" ],
                                    [ "O", "O", "X" , "O" , "O" ],
                                    [ "X", "O", "O" , "O" , "X" ],
                                    [ "O", "O", "X" , "O" , "O" ],
                                    [ "O", "X", "O" , "X" , "O" ]
                                ],
                                gap: Math.random()*2+1.5,
                                ancor: [ 2, 2 ],
                                focus: { x: 0, y: -1, z: 0 },
                                offset: { x: 0, y: 8, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "amw:tentacle",
                                        source_target: "summon",
                                        spell: {
                                            id: magicFunction.castMultipleSpell,
                                            modifier: {
                                                spell: [
                                                    {
                                                        id: magicFunction.castRandomLocationSpell,
                                                        modifier: {
                                                            size: { x: 4, y: 0, z: 4 },
                                                            offset: { x: 0, y: 6, z: 0 },
                                                            strength: 1,
                                                            spell: {
                                                                id: magicFunction.castAtFloor,
                                                                modifier: {
                                                                    spell: {
                                                                        id: magicFunction.createParticle,
                                                                        modifier: {
                                                                            particle: "magic:tentacle_shadow",
                                                                            data: [
                                                                                {
                                                                                    name: "duration",
                                                                                    data: 5
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.createParticle,
                                                        modifier: {
                                                            particle: "magic:floor_smoke",
                                                            data: [
                                                                {
                                                                    name: "color",
                                                                    data: {
                                                                        red: 0.35,
                                                                        green: 0.3,
                                                                        blue: 0.5
                                                                    }
                                                                },
                                                                {
                                                                    name: "modifier",
                                                                    data: {
                                                                        x: 5,
                                                                        y: 7,
                                                                        z: 3
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    },
                                                    {
                                                        id: magicFunction.burstCast,
                                                        modifier: {
                                                            duration: 120,
                                                            delay: 2,
                                                            spell: {
                                                                id: magicFunction.distanceTarget,
                                                                modifier: {
                                                                    distance: 4,
                                                                    include_source: false,
                                                                    offset: {
                                                                        x: 0,
                                                                        y: 0,
                                                                        z: 0
                                                                    },
                                                                    impact: {
                                                                        id: magicFunction.tentacleEffect,
                                                                        modifier: {
                                                                            strength: 2
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            stop_spell: {
                                                                id: magicFunction.despawnTarget,
                                                                modifier: {
                                                                }
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Create a area of tentacle that causing destructive effect for 6 seconds."
    },
    "tentacle": {
        name: "Tentacle",
        path: "textures/ui/magic_list/tentacle",
        attribute: [ "transmutation", "dark" ],
        grade: "intermediate",
        type: "curse",
        cast_duration: 13,
        soul_cost: 26,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 72,
            impact: {
                id: magicFunction.summonAtFloor,
                modifier: {
                    type: "amw:tentacle",
                    source_target: "summon",
                    spell: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.iterationCast,
                                    modifier: {
                                        iteration: 3,
                                        spell: {
                                            id: magicFunction.castRandomLocationSpell,
                                            modifier: {
                                                size: { x: 4, y: 0, z: 4 },
                                                offset: { x: 0, y: 6, z: 0 },
                                                strength: 1,
                                                spell: {
                                                    id: magicFunction.castAtFloor,
                                                    modifier: {
                                                        spell: {
                                                            id: magicFunction.createParticle,
                                                            modifier: {
                                                                particle: "magic:tentacle_shadow",
                                                                data: [
                                                                    {
                                                                        name: "duration",
                                                                        data: 5
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.createParticle,
                                    modifier: {
                                        particle: "magic:floor_smoke",
                                        data: [
                                            {
                                                name: "color",
                                                data: {
                                                    red: 0.35,
                                                    green: 0.3,
                                                    blue: 0.5
                                                }
                                            },
                                            {
                                                name: "modifier",
                                                data: {
                                                    x: 5,
                                                    y: 7,
                                                    z: 3
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    id: magicFunction.burstCast,
                                    modifier: {
                                        duration: 120,
                                        delay: 2,
                                        spell: {
                                            id: magicFunction.distanceTarget,
                                            modifier: {
                                                distance: 4,
                                                include_source: false,
                                                offset: {
                                                    x: 0,
                                                    y: 0,
                                                    z: 0
                                                },
                                                impact: {
                                                    id: magicFunction.tentacleEffect,
                                                    modifier: {
                                                        strength: 2
                                                    }
                                                }
                                            }
                                        },
                                        stop_spell: {
                                            id: magicFunction.despawnTarget,
                                            modifier: {
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: ""
    },
    "leviathan_aura": {
        name: "Leviathan Aura",
        path: "textures/ui/magic_list/leviathan_aura",
        attribute: [ "transmutation", "water" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 40,
        soul_cost: 20,
        function: magicFunction.createSourceDummy,
        modifier: {
            head_location: true,
            spell: {
                id: magicFunction.burstCast,
                modifier: {
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "water_magic",
                                multiply: 10,
                                additive: 20
                            }
                        ]
                    },
                    spell: {
                        delay: 10,
                        id: magicFunction.castSpellOrb,
                        modifier: {
                            type: "amw:leviathan_aura",
                            power: 0.75,
                            duration: {
                                magic_attributes: [
                                    {
                                        magic_type: "water_magic",
                                        multiply: 10,
                                        additive: 40
                                    }
                                ]
                            },
                            ongoing: {
                                id: magicFunction.distanceTarget,
                                modifier: {
                                    distance: 2,
                                    impact: {
                                        id: magicFunction.castMultipleSpell,
                                        modifier: {
                                            spell: [
                                                {
                                                    id: magicFunction.damageToSource,
                                                    modifier: {
                                                        strength: 1
                                                    }
                                                },
                                                {
                                                    id: magicFunction.setKnockbackToTarget,
                                                    modifier: {
                                                        target: "source",
                                                        inverse: true,
                                                        strength: 3
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: ""
    },
    "multiple_fire_bullet": {
        name: "Multiple Fire Bullet",
        path: "textures/ui/magic_list/multiple_fire_bullet",
        attribute: [ "transmutation", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 30,
        function: magicFunction.castRotatedSpell,
        modifier: {
            count: {
                magic_attributes: [
                    {
                        magic_type: "fire_magic",
                        multiply: 1,
                        additive: 3
                    }
                ]
            },
            degree: 30,
            distance: 0.15,
            axis: "y",
            spell: {
                id: magicFunction.castSpellOrb,
                modifier: {
                    type: "amw:magic_orb<hard_fire_orb>",
                    power: {
                        magic_attributes: [
                            {
                                magic_type: "fire_magic",
                                multiply: 0.1,
                                additive: 0.1
                            }
                        ]
                    },
                    duration: 100,
                    particles: "magic:fireball_effect",
                    ongoing: {
                        id: magicFunction.distanceTarget,
                        particles: "magic:fire_impact",
                        modifier: {
                            distance: 1.6,
                            impact: {
                                id: magicFunction.setFire,
                                modifier: {
                                    strength: 4
                                }
                            }
                        }
                    },
                    impact: {
                        id: magicFunction.distanceTarget,
                        particles: "magic:fire_impact",
                        modifier: {
                            distance: 2,
                            impact: {
                                id: magicFunction.setFire,
                                modifier: {
                                    strength: 4
                                }
                            }
                        }
                    }
                }
            }
        },
        description: "Create a spread of fire orb that burn target."
    },
    "void_swarm": {
        name: "Void Swarm",
        path: "textures/ui/magic_list/void_swarm",
        attribute: [ "creation", "void" ],
        grade: "advance",
        type: "create",
        cast_duration: 40,
        soul_cost: 23,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "void_magic",
                        multiply: 5,
                        additive: 10
                    }
                ]
            },
            delay: 5,
            enable_cooldown: true,
            can_cancel: true,
            use_animation: true,
            force_slot: true,
            spell: {
                id: magicFunction.castRotatedSpell,
                modifier: {
                    count: 3,
                    degree: 30,
                    distance: 0.15,
                    axis: "y",
                    spell: {
                        id: magicFunction.castRandomRotatedSpell,
                        modifier: {
                            strength: 0.015,
                            head_location: true,
                            spell: {
                                id: magicFunction.castProjectile,
                                modifier: {
                                    type: "amw:magic_orb<hard_void_orb>",
                                    power: 0.15,
                                    despawn: 1000,
                                    spell: {
                                        id: magicFunction.castMultipleSpell,
                                        modifier: {
                                            spell: [
                                                {
                                                    id: magicFunction.changeProjectileComponents,
                                                    modifier: {
                                                        gravity: 0.0,
                                                        air_inertia: 1.0
                                                    }
                                                },
                                                {
                                                    id: magicFunction.setBounceProjectile,
                                                    modifier: {
                                                        max_step: 16
                                                    }
                                                },
                                                {
                                                    id: magicFunction.projectileHitCast,
                                                    modifier: {
                                                        hit_type: "entity",
                                                        impact: {
                                                            id: magicFunction.damageToSource,
                                                            modifier: {
                                                                strength: 2
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: ""
    },
    "arrow_burst": {
        name: "Arrow Burst",
        path: "textures/ui/magic_list/arrow_burst",
        attribute: [ "creation", "nature" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 25,
        soul_cost: 13,
        function: magicFunction.castRotatedSpell,
        modifier: {
            count: {
                magic_attributes: [
                    {
                        magic_type: "nature_magic",
                        multiply: 1,
                        additive: 2
                    }
                ]
            },
            degree: {
                magic_attributes: [
                    {
                        magic_type: "nature_magic",
                        multiply: 1,
                        additive: 10
                    }
                ]
            },
            distance: 0.05,
            axis: "y",
            spell: {
                id: magicFunction.castRandomRotatedSpell,
                modifier: {
                    strength: 0.075,
                    head_location: true,
                    spell: {
                        id: magicFunction.castProjectile,
                        modifier: {
                            type: "amw:magic_arrow",
                            power: {
                                magic_attributes: [
                                    {
                                        magic_type: "fire_magic",
                                        multiply: 0.15,
                                        additive: 1.3
                                    }
                                ]
                            },
                            despawn: 150
                        }
                    }
                }
            }
        },
        description: ""
    },
    "burst_of_light": {
        name: "Burst Of Light",
        path: "textures/ui/magic_list/burst_of_light",
        attribute: [ "transmutation", "light" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 20,
        soul_cost: 24,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castRotatedSpell,
                    modifier: {
                        count: 10,
                        degree: 360,
                        distance: 0.5,
                        axis: "y",
                        reset_axis: "x",
                        offset: {
                            x: 0, 
                            y: -0.6,
                            z: 0
                        },
                        spell: {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 4,
                                delay: 0,
                                spell: {
                                    id: magicFunction.castSpellAtView,
                                    modifier: {
                                        range: 16,
                                        impact: {
                                            id: magicFunction.lightBeam,
                                            modifier: {
                                                strength: 6
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castRotatedSpell,
                    modifier: {
                        count: 24,
                        degree: 360,
                        distance: 0.5,
                        axis: "y",
                        reset_axis: "x",
                        offset: {
                            x: 0, 
                            y: -0.2,
                            z: 0
                        },
                        spell: {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 14,
                                delay: 0,
                                spell: {
                                    id: magicFunction.castSpellAtView,
                                    modifier: {
                                        range: 6,
                                        impact: {
                                            id: magicFunction.lightBeam,
                                            modifier: {
                                                strength: 9
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castRotatedSpell,
                    modifier: {
                        count: 16,
                        degree: 360,
                        distance: 0.5,
                        axis: "y",
                        reset_axis: "x",
                        offset: {
                            x: 0, 
                            y: -0.8,
                            z: 0
                        },
                        spell: {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 14,
                                delay: 0,
                                spell: {
                                    id: magicFunction.castSpellAtView,
                                    modifier: {
                                        range: 8,
                                        impact: {
                                            id: magicFunction.lightBeam,
                                            modifier: {
                                                strength: 7
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Create burst of light aroud yourself."
    },
    "meteor_rain": {
        name: "Meteor Rain",
        path: "textures/ui/magic_list/meteor_rain",
        attribute: [ "transmutation", "fire" ],
        grade: "advance",
        type: "create",
        cast_duration: 20,
        soul_cost: 50,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 48,
            impact: {
                id: magicFunction.sequenceCast,
                modifier: {
                    delay: 10,
                    enable_cooldown: true,
                    spell: [
                        {
                            id: magicFunction.createCircleBlastFromSource,
                            modifier: {
                                r: 1,
                                g: 1,
                                b: 1,
                                a: 0.5,
                                size: 15,
                                duration: 2,
                                offset: {x: 0, y: 1.1, z: 0}
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 20,
                                            additive: 180
                                        }
                                    ]
                                },
                                delay: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: -1,
                                            additive: 10
                                        }
                                    ]
                                },
                                enable_cooldown: true,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.castRandomSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.castMultipleLocation,
                                                            modifier: {
                                                                formation: [
                                                                    [ "O", "O", "O", "O", "O" ],
                                                                    [ "O", "O", "O", "O", "O" ],
                                                                    [ "X", "O", "O", "O", "O" ],
                                                                    [ "O", "O", "O", "O", "O" ],
                                                                    [ "O", "X", "O", "X", "O" ]
                                                                ],
                                                                gap: 4,
                                                                ancor: [ 3, 3 ],
                                                                focus: { x: Math.random() * 10 - 5, y: -40, z: Math.random() * 10 - 5 },
                                                                offset: { x: Math.random() * 10 - 5, y: 20, z: Math.random() * 10 - 5 },
                                                                impact: {
                                                                    id: magicFunction.castProjectile,
                                                                    modifier: {
                                                                        type: "amw:magic_fireball",
                                                                        power: Math.random() * 0.7 + 0.3
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.castMultipleLocation,
                                                            modifier: {
                                                                formation: [
                                                                    [ "O", "O", "O", "X", "O" ],
                                                                    [ "O", "O", "O", "O", "O" ],
                                                                    [ "X", "O", "X", "O", "O" ],
                                                                    [ "O", "O", "O", "O", "O" ],
                                                                    [ "O", "X", "O", "O", "O" ]
                                                                ],
                                                                gap: 4,
                                                                ancor: [ 3, 3 ],
                                                                focus: { x: Math.random() * 10 - 5, y: -40, z: Math.random() * 10 - 5 },
                                                                offset: { x: Math.random() * 10 - 5, y: 20, z: Math.random() * 10 - 5 },
                                                                impact: {
                                                                    id: magicFunction.castProjectile,
                                                                    modifier: {
                                                                        type: "amw:magic_fireball",
                                                                        power: Math.random() * 0.5 + 0.5
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.castMultipleLocation,
                                                            modifier: {
                                                                formation: [
                                                                    [ "O", "O", "X", "O", "O" ],
                                                                    [ "X", "O", "O", "O", "O" ],
                                                                    [ "O", "O", "O", "O", "X" ],
                                                                    [ "O", "O", "O", "O", "O" ],
                                                                    [ "O", "O", "X", "O", "O" ]
                                                                ],
                                                                gap: 4,
                                                                ancor: [ 3, 3 ],
                                                                focus: { x: Math.random() * 10 - 5, y: -40, z: Math.random() * 10 - 5 },
                                                                offset: { x: Math.random() * 10 - 5, y: 20, z: Math.random() * 10 - 5 },
                                                                impact: {
                                                                    id: magicFunction.castProjectile,
                                                                    modifier: {
                                                                        type: "amw:magic_fireball",
                                                                        power: Math.random() * 0.4 + 0.6
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.castMultipleLocation,
                                                            modifier: {
                                                                formation: [
                                                                    [ "X", "O", "O", "O", "O" ],
                                                                    [ "O", "O", "O", "X", "O" ],
                                                                    [ "O", "X", "O", "O", "O" ],
                                                                    [ "O", "O", "O", "O", "O" ],
                                                                    [ "X", "O", "O", "O", "O" ]
                                                                ],
                                                                gap: 4,
                                                                ancor: [ 3, 3 ],
                                                                focus: { x: Math.random() * 10 - 5, y: -40, z: Math.random() * 10 - 5 },
                                                                offset: { x: Math.random() * 10 - 5, y: 20, z: Math.random() * 10 - 5 },
                                                                impact: {
                                                                    id: magicFunction.castProjectile,
                                                                    modifier: {
                                                                        type: "amw:magic_fireball",
                                                                        power: Math.random() * 0.6 + 0.4
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                id: magicFunction.setCameraShake,
                                                modifier: {
                                                    radius: 32,
                                                    duration: 10,
                                                    strength: 0.1
                                                }
                                            }
                                        ]
                                    }
                                },
                                stop_spell: {
                                    id: magicFunction.setCameraShake,
                                    modifier: {
                                        radius: 32,
                                        duration: 40,
                                        strength: 0.1
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Summon a meteor rain for 11 seconds."
    },
    "scorch": {
        name: "Scorch",
        path: "textures/ui/magic_list/scorch",
        attribute: [ "transmutation", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 20,
        soul_cost: 15,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 96,
            create_new_source: true,
            impact: {
                id: magicFunction.sequenceCast,
                modifier: {
                    delay: 5,
                    enable_cooldown: true,
                    spell: [
                        {
                            id: magicFunction.createCircleBlastFromSource,
                            modifier: {
                                r: 0.71,
                                g: 0.29,
                                b: 0.05,
                                a: 0.5,
                                size: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 0.5,
                                            additive: 1
                                        }
                                    ]
                                },
                                duration: 0.5,
                                offset: {x: 0, y: 0.2, z: 0}
                            }
                        },
                        {
                            id: magicFunction.distanceTarget,
                            modifier: {
                                distance: {
                                    magic_attributes: [
                                        {
                                            magic_type: "fire_magic",
                                            multiply: 0.25,
                                            additive: 4
                                        }
                                    ]
                                },
                                impact: {
                                    id: magicFunction.setFire,
                                    modifier: {
                                        strength: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "fire_magic",
                                                    multiply: 2,
                                                    additive: 3
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:magic_swirl",
                                offset: {
                                    x: 0,
                                    y: 1,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "modifier",
                                        data: {
                                            x: 5,
                                            y: 0.4,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.71,
                                            green: 0.29,
                                            blue: 0.05,
                                            alpha: 1.0
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "lightning_bolt": {
        name: "Lightning Bolt",
        path: "textures/ui/magic_list/lightning_bolt",
        attribute: [ "transmutation", "thunder" ],
        grade: "basic",
        type: "create",
        cast_duration: 15,
        soul_cost: 11,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: 96,
            impact: {
                id: magicFunction.sequenceCast,
                modifier: {
                    delay: 10,
                    enable_cooldown: true,
                    spell: [
                        {
                            id: magicFunction.createCircleBlastFromSource,
                            modifier: {
                                r: 1,
                                g: 1,
                                b: 1,
                                a: 0.5,
                                size: 3,
                                duration: 0.9,
                                offset: {x: 0, y: 0.2, z: 0}
                            }
                        },
                        {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.lightning,
                                        modifier: {
                                        }
                                    },
                                    {
                                        id: magicFunction.setCameraShake,
                                        modifier: {
                                            radius: 16,
                                            duration: 10,
                                            strength: 0.1
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        description: "Summon a lightning bolt at target location."
    },
    "sacred_hammer": {
        name: "Sacred Hammer",
        path: "textures/ui/magic_list/sacred_hammer",
        attribute: [ "conjuration", "creation", "thunder" ],
        grade: "advance",
        type: "summon",
        cast_duration: 35,
        soul_cost: 31,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "mjolnir_control",
                        restart_cluster: true,
                        duration: 600
                    }
                },
                {
                    id: magicFunction.summonAtLocation,
                    modifier: {
                        type: "amw:mjolnir",
                        despawn: 600,
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.addSingleScanEntity,
                                        modifier: {
                                            cluster_name: "mjolnir_control",
                                            duration: 599
                                        }
                                    },
                                    {
                                        id: magicFunction.burstCast,
                                        modifier: {
                                            duration: 599,
                                            delay: 20,
                                            spell: {
                                                id: magicFunction.castMultipleSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.distanceTarget,
                                                            modifier: {
                                                                distance: 6,
                                                                exclude_families: [ "inanimate" ],
                                                                impact: {
                                                                    id: magicFunction.thunderStreak,
                                                                    modifier: {
                                                                        strength: {
                                                                            magic_attributes: [
                                                                                {
                                                                                    magic_type: "thunder_magic",
                                                                                    multiply: 2,
                                                                                    additive: 1
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.lookAtVelocity,
                                                            modifier: {}
                                                        },
                                                        {
                                                            id: magicFunction.createParticle,
                                                            modifier: {
                                                                particle: "magic:lightning_cast_impact"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: 599,
                        enable_cooldown: true,
                        force_slot: false,
                        spell: {
                            id: magicFunction.castSpellAtView,
                            modifier: {
                                range: 64,
                                create_new_source: true,
                                impact: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        single_scan: true,
                                        distance: 8,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.castAtScanEntity,
                                            modifier: {
                                                cluster_name: "mjolnir_control",
                                                spell: {
                                                    id: magicFunction.setKnockbackToTarget,
                                                    modifier: {
                                                        target: "source",
                                                        strength: 1.8,
                                                        offset: {
                                                            x: 0,
                                                            y: 3,
                                                            z: 0
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        empty_spell: {
                                            id: magicFunction.castAtActor,
                                            modifier: {
                                                spell: {
                                                    id: magicFunction.castMultipleLocation,
                                                    modifier: {
                                                        formation: [
                                                            [ "X" ]
                                                        ],
                                                        gap: 2,
                                                        ancor: [ 1, 1 ],
                                                        focus: { x: 0, y: 1, z: 0 },
                                                        offset: { x: 3, y: 1, z: -2 },
                                                        impact: {
                                                            id: magicFunction.castAtScanEntity,
                                                            modifier: {
                                                                cluster_name: "mjolnir_control",
                                                                spell: {
                                                                    id: magicFunction.setKnockbackToTarget,
                                                                    modifier: {
                                                                        target: "source",
                                                                        strength: 0.5,
                                                                        deadzone: 0.2
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        stop_spell: {
                            id: magicFunction.castAtScanEntity,
                            modifier: {
                                cluster_name: "mjolnir_control",
                                spell: {
                                    id: magicFunction.despawnTarget,
                                    modifier: {}
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Summon a Mjolnir beside caster for 30 seconds. Mjolnir can strike a thunder aroudn target distance."
    },
    "thunder_streak": {
        name: "Thunder Streak",
        path: "textures/ui/magic_list/thunder_streak",
        attribute: [ "transmutation", "thunder" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 25,
        soul_cost: 21,
        function: magicFunction.sequenceCast,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "thunder_streak_chain",
                        restart_cluster: true,
                        duration: 15
                    }
                },
                {
                    id: magicFunction.distanceTarget,
                    modifier: {
                        distance: 6,
                        impact: {
                            id: magicFunction.sourceTest,
                            modifier: {
                                exclude_types: [ "minecraft:item", "minecraft:xp_orb" ],
                                single_scan: {
                                    cluster_name: "thunder_streak_chain"
                                },
                                spell: {
                                    id: magicFunction.sequenceCast,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.addSingleScan,
                                                modifier: {
                                                    cluster_name: "thunder_streak_chain"
                                                }
                                            },
                                            {
                                                id: magicFunction.thunderStreak,
                                                modifier: {
                                                    strength: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "thunder_magic",
                                                                multiply: 2,
                                                                additive: 4
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: 6,
                                                    impact: {
                                                        id: magicFunction.sourceTest,
                                                        modifier: {
                                                            exclude_types: [ "minecraft:item", "minecraft:xp_orb" ],
                                                            single_scan: {
                                                                cluster_name: "thunder_streak_chain"
                                                            },
                                                            spell: {
                                                                id: magicFunction.sequenceCast,
                                                                modifier: {
                                                                    spell: [
                                                                        {
                                                                            id: magicFunction.addSingleScan,
                                                                            modifier: {
                                                                                cluster_name: "thunder_streak_chain"
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.thunderStreak,
                                                                            modifier: {
                                                                                strength: {
                                                                                    magic_attributes: [
                                                                                        {
                                                                                            magic_type: "thunder_magic",
                                                                                            multiply: 2,
                                                                                            additive: 3
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.distanceTarget,
                                                                            modifier: {
                                                                                distance: 6,
                                                                                impact: {
                                                                                    id: magicFunction.sourceTest,
                                                                                    modifier: {
                                                                                        exclude_types: [ "minecraft:item", "minecraft:xp_orb" ],
                                                                                        single_scan: {
                                                                                            cluster_name: "thunder_streak_chain"
                                                                                        },
                                                                                        spell: {
                                                                                            id: magicFunction.sequenceCast,
                                                                                            modifier: {
                                                                                                spell: [
                                                                                                    {
                                                                                                        id: magicFunction.addSingleScan,
                                                                                                        modifier: {
                                                                                                            cluster_name: "thunder_streak_chain"
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        id: magicFunction.thunderStreak,
                                                                                                        modifier: {
                                                                                                            strength: {
                                                                                                                magic_attributes: [
                                                                                                                    {
                                                                                                                        magic_type: "thunder_magic",
                                                                                                                        multiply: 1,
                                                                                                                        additive: 2
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        }
                                                                                                    },
                                                                                                    {
                                                                                                        id: magicFunction.distanceTarget,
                                                                                                        modifier: {
                                                                                                            distance: 6,
                                                                                                            impact: {
                                                                                                                id: magicFunction.sourceTest,
                                                                                                                modifier: {
                                                                                                                    exclude_types: [ "minecraft:item", "minecraft:xp_orb" ],
                                                                                                                    single_scan: {
                                                                                                                        cluster_name: "thunder_streak_chain"
                                                                                                                    },
                                                                                                                    spell: {
                                                                                                                        id: magicFunction.thunderStreak,
                                                                                                                        modifier: {
                                                                                                                            strength: {
                                                                                                                                magic_attributes: [
                                                                                                                                    {
                                                                                                                                        magic_type: "thunder_magic",
                                                                                                                                        multiply: 1,
                                                                                                                                        additive: 1
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: "Strike a thunder to target and spread to nearby enemies"
    },
    "evoker_fang": {
        name: "Evoker Fang",
        path: "textures/ui/magic_list/evoker_fang",
        attribute: [ "creation", "conjuration", "dark" ],
        grade: "intermediate",
        type: "summon",
        cast_duration: 10,
        soul_cost: 24,
        function: magicFunction.castSpellInlineView,
        modifier: {
            distance: {
                magic_attributes: [
                    {
                        magic_type: "dark_magic",
                        multiply: 2,
                        additive: 12
                    }
                ]
            },
            deadzone: 2,
            gap: 1,
            spell: {
                id: magicFunction.summonAtFloor,
                delay: 0,
                modifier: {
                    type: "minecraft:evocation_fang"
                }
            }
        },
        description: "Create an imitation of a evoker fang from Evoker's magic ability."
    },
    "fang_aura": {
        name: "Fang Aura",
        path: "textures/ui/magic_list/fang_aura",
        attribute: [ "creation", "conjuration", "dark", "nature" ],
        grade: "advance",
        type: "summon",
        cast_duration: 10,
        soul_cost: 64,
        function: magicFunction.burstCast,
        modifier: {
            delay: 36,
            duration: 720,
            enable_cooldown: true,
            force_slot: false,
            spell: {
                id: magicFunction.sequenceCast,
                modifier: {
                    delay: 2,
                    spell: [
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "X", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "X", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "X", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "X", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "X", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "X", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "X", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "X", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "X", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "X", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "X", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "X" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "X" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "X" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "X", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.castMultipleLocation,
                            modifier: {
                                formation: [
                                    [ "O", "O", "O", "O", "X", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                    [ "O", "O", "O", "O", "O", "O", "O" ],
                                ],
                                gap: 1,
                                ancor: [ 4, 4 ],
                                focus: "view",
                                offset: { x: 0, y: 3, z: 0 },
                                impact: {
                                    id: magicFunction.summonAtFloor,
                                    modifier: {
                                        type: "minecraft:evocation_fang"
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "greater_evoker_fang": {
        name: "Greater Evoker Fang",
        path: "textures/ui/magic_list/greater_evoker_fang",
        attribute: [ "creation", "conjuration", "dark", "fire" ],
        grade: "expert",
        type: "summon",
        cast_duration: 30,
        soul_cost: 26,
        function: magicFunction.sequenceCast,
        modifier: {
            delay: 2,
            spell: [
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "X", "O", "O", "O" ],
                            [ "O", "O", "X", "O", "X", "O", "O" ],
                            [ "O", "O", "O", "X", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                        ],
                        gap: 1.5,
                        ancor: [ 4, 4 ],
                        focus: "view",
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            delay: 0,
                            modifier: {
                                do_not_spawn_at_actor: true,
                                type: "minecraft:evocation_fang",
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 1.5,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.sourceTest,
                                            modifier: {
                                                exclude_types: [ "minecraft:evocation_fang" ],
                                                spell: {
                                                    id: magicFunction.setFire,
                                                    modifier: {
                                                        strength: 5
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "X", "X", "X", "O", "O" ],
                            [ "O", "O", "X", "O", "X", "O", "O" ],
                            [ "O", "O", "X", "X", "X", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                        ],
                        gap: 1.5,
                        ancor: [ 4, 4 ],
                        focus: "view",
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            delay: 0,
                            modifier: {
                                do_not_spawn_at_actor: true,
                                type: "minecraft:evocation_fang",
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 1.5,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.sourceTest,
                                            modifier: {
                                                exclude_types: [ "minecraft:evocation_fang" ],
                                                spell: {
                                                    id: magicFunction.setFire,
                                                    modifier: {
                                                        strength: 5
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "X", "O", "O", "O" ],
                            [ "O", "O", "X", "O", "X", "O", "O" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "O", "O", "X", "O", "X", "O", "O" ],
                            [ "O", "O", "O", "X", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                        ],
                        gap: 1.5,
                        ancor: [ 4, 4 ],
                        focus: "view",
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            delay: 0,
                            modifier: {
                                do_not_spawn_at_actor: true,
                                type: "minecraft:evocation_fang",
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 1.5,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.sourceTest,
                                            modifier: {
                                                exclude_types: [ "minecraft:evocation_fang" ],
                                                spell: {
                                                    id: magicFunction.setFire,
                                                    modifier: {
                                                        strength: 5
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "X", "X", "X", "O", "O" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "O", "O", "X", "X", "X", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                        ],
                        gap: 1.5,
                        ancor: [ 4, 4 ],
                        focus: "view",
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            delay: 0,
                            modifier: {
                                do_not_spawn_at_actor: true,
                                type: "minecraft:evocation_fang",
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 1.5,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.sourceTest,
                                            modifier: {
                                                exclude_types: [ "minecraft:evocation_fang" ],
                                                spell: {
                                                    id: magicFunction.setFire,
                                                    modifier: {
                                                        strength: 5
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "O", "O", "X", "O", "O", "O" ],
                            [ "O", "O", "X", "O", "X", "O", "O" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "X", "O", "O", "O", "O", "O", "X" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "O", "O", "X", "O", "X", "O", "O" ],
                            [ "O", "O", "O", "X", "O", "O", "O" ],
                        ],
                        gap: 1.5,
                        ancor: [ 4, 4 ],
                        focus: "view",
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            delay: 0,
                            modifier: {
                                do_not_spawn_at_actor: true,
                                type: "minecraft:evocation_fang",
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 1.5,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.sourceTest,
                                            modifier: {
                                                exclude_types: [ "minecraft:evocation_fang" ],
                                                spell: {
                                                    id: magicFunction.setFire,
                                                    modifier: {
                                                        strength: 5
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "O", "O", "X", "X", "X", "O", "O" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "X", "O", "O", "O", "O", "O", "X" ],
                            [ "X", "O", "O", "O", "O", "O", "X" ],
                            [ "X", "O", "O", "O", "O", "O", "X" ],
                            [ "O", "X", "O", "O", "O", "X", "O" ],
                            [ "O", "O", "X", "X", "X", "O", "O" ],
                        ],
                        gap: 1.5,
                        ancor: [ 4, 4 ],
                        focus: "view",
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.summonAtFloor,
                            delay: 0,
                            modifier: {
                                do_not_spawn_at_actor: true,
                                type: "minecraft:evocation_fang",
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 1.5,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.sourceTest,
                                            modifier: {
                                                exclude_types: [ "minecraft:evocation_fang" ],
                                                spell: {
                                                    id: magicFunction.setFire,
                                                    modifier: {
                                                        strength: 5
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castRotatedSpell,
                    modifier: {
                        count: 8,
                        degree: 360,
                        axis: "y",
                        reset_axis: "x",
                        spell: {
                            id: magicFunction.castSpellOrb,
                            modifier: {
                                type: "amw:magic_orb_dummy",
                                power: 0.75,
                                duration: 10,
                                ongoing: {
                                    id: magicFunction.summonAtFloor,
                                    delay: 0,
                                    modifier: {
                                        do_not_spawn_at_actor: true,
                                        type: "minecraft:evocation_fang",
                                        spell: {
                                            id: magicFunction.distanceTarget,
                                            modifier: {
                                                distance: 1.5,
                                                exclude_families: [ "inanimate" ],
                                                impact: {
                                                    id: magicFunction.sourceTest,
                                                    modifier: {
                                                        exclude_types: [ "minecraft:evocation_fang" ],
                                                        spell: {
                                                            id: magicFunction.setFire,
                                                            modifier: {
                                                                strength: 5
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castMultipleLocation,
                    modifier: {
                        formation: [
                            [ "X", "O", "O", "O", "O", "O", "X" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "O", "O", "O", "O", "O", "O", "O" ],
                            [ "X", "O", "O", "O", "O", "O", "X" ],
                        ],
                        gap: 2,
                        ancor: [ 4, 4 ],
                        focus: { x: 0, y: 0, z: 0 },
                        offset: { x: 0, y: 3, z: 0 },
                        impact: {
                            id: magicFunction.sequenceCast,
                            modifier: {
                                delay: 4,
                                spell: [
                                    {
                                        id: magicFunction.summonAtFloor,
                                        modifier: {
                                            do_not_spawn_at_actor: true,
                                            type: "minecraft:evocation_fang",
                                            spell: {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: 1.5,
                                                    exclude_families: [ "inanimate" ],
                                                    impact: {
                                                        id: magicFunction.sourceTest,
                                                        modifier: {
                                                            exclude_types: [ "minecraft:evocation_fang" ],
                                                            spell: {
                                                                id: magicFunction.setFire,
                                                                modifier: {
                                                                    strength: 5
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castMultipleLocation,
                                        modifier: {
                                            formation: [
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "O", "X", "O", "O", "O" ],
                                                [ "O", "O", "X", "O", "X", "O", "O" ],
                                                [ "O", "O", "O", "X", "O", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                            ],
                                            gap: 1.5,
                                            ancor: [ 4, 4 ],
                                            focus: "view",
                                            offset: { x: 0, y: 3, z: 0 },
                                            impact: {
                                                id: magicFunction.summonAtFloor,
                                                delay: 0,
                                                modifier: {
                                                    do_not_spawn_at_actor: true,
                                                    type: "minecraft:evocation_fang",
                                                    spell: {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 1.5,
                                                            exclude_families: [ "inanimate" ],
                                                            impact: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    exclude_types: [ "minecraft:evocation_fang" ],
                                                                    spell: {
                                                                        id: magicFunction.setFire,
                                                                        modifier: {
                                                                            strength: 5
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castMultipleLocation,
                                        modifier: {
                                            formation: [
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "X", "X", "X", "O", "O" ],
                                                [ "O", "O", "X", "O", "X", "O", "O" ],
                                                [ "O", "O", "X", "X", "X", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                            ],
                                            gap: 1.5,
                                            ancor: [ 4, 4 ],
                                            focus: "view",
                                            offset: { x: 0, y: 3, z: 0 },
                                            impact: {
                                                id: magicFunction.summonAtFloor,
                                                delay: 0,
                                                modifier: {
                                                    do_not_spawn_at_actor: true,
                                                    type: "minecraft:evocation_fang",
                                                    spell: {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 1.5,
                                                            exclude_families: [ "inanimate" ],
                                                            impact: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    exclude_types: [ "minecraft:evocation_fang" ],
                                                                    spell: {
                                                                        id: magicFunction.setFire,
                                                                        modifier: {
                                                                            strength: 5
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castMultipleLocation,
                                        modifier: {
                                            formation: [
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "O", "X", "O", "O", "O" ],
                                                [ "O", "O", "X", "O", "X", "O", "O" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "O", "O", "X", "O", "X", "O", "O" ],
                                                [ "O", "O", "O", "X", "O", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                            ],
                                            gap: 1.5,
                                            ancor: [ 4, 4 ],
                                            focus: "view",
                                            offset: { x: 0, y: 3, z: 0 },
                                            impact: {
                                                id: magicFunction.summonAtFloor,
                                                delay: 0,
                                                modifier: {
                                                    do_not_spawn_at_actor: true,
                                                    type: "minecraft:evocation_fang",
                                                    spell: {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 1.5,
                                                            exclude_families: [ "inanimate" ],
                                                            impact: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    exclude_types: [ "minecraft:evocation_fang" ],
                                                                    spell: {
                                                                        id: magicFunction.setFire,
                                                                        modifier: {
                                                                            strength: 5
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castMultipleLocation,
                                        modifier: {
                                            formation: [
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                                [ "O", "O", "X", "X", "X", "O", "O" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "O", "O", "X", "X", "X", "O", "O" ],
                                                [ "O", "O", "O", "O", "O", "O", "O" ],
                                            ],
                                            gap: 1.5,
                                            ancor: [ 4, 4 ],
                                            focus: "view",
                                            offset: { x: 0, y: 3, z: 0 },
                                            impact: {
                                                id: magicFunction.summonAtFloor,
                                                delay: 0,
                                                modifier: {
                                                    do_not_spawn_at_actor: true,
                                                    type: "minecraft:evocation_fang",
                                                    spell: {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 1.5,
                                                            exclude_families: [ "inanimate" ],
                                                            impact: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    exclude_types: [ "minecraft:evocation_fang" ],
                                                                    spell: {
                                                                        id: magicFunction.setFire,
                                                                        modifier: {
                                                                            strength: 5
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castMultipleLocation,
                                        modifier: {
                                            formation: [
                                                [ "O", "O", "O", "X", "O", "O", "O" ],
                                                [ "O", "O", "X", "O", "X", "O", "O" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "X", "O", "O", "O", "O", "O", "X" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "O", "O", "X", "O", "X", "O", "O" ],
                                                [ "O", "O", "O", "X", "O", "O", "O" ],
                                            ],
                                            gap: 1.5,
                                            ancor: [ 4, 4 ],
                                            focus: "view",
                                            offset: { x: 0, y: 3, z: 0 },
                                            impact: {
                                                id: magicFunction.summonAtFloor,
                                                delay: 0,
                                                modifier: {
                                                    do_not_spawn_at_actor: true,
                                                    type: "minecraft:evocation_fang",
                                                    spell: {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 1.5,
                                                            exclude_families: [ "inanimate" ],
                                                            impact: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    exclude_types: [ "minecraft:evocation_fang" ],
                                                                    spell: {
                                                                        id: magicFunction.setFire,
                                                                        modifier: {
                                                                            strength: 5
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castMultipleLocation,
                                        modifier: {
                                            formation: [
                                                [ "O", "O", "X", "X", "X", "O", "O" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "X", "O", "O", "O", "O", "O", "X" ],
                                                [ "X", "O", "O", "O", "O", "O", "X" ],
                                                [ "X", "O", "O", "O", "O", "O", "X" ],
                                                [ "O", "X", "O", "O", "O", "X", "O" ],
                                                [ "O", "O", "X", "X", "X", "O", "O" ],
                                            ],
                                            gap: 1.5,
                                            ancor: [ 4, 4 ],
                                            focus: "view",
                                            offset: { x: 0, y: 3, z: 0 },
                                            impact: {
                                                id: magicFunction.summonAtFloor,
                                                delay: 0,
                                                modifier: {
                                                    do_not_spawn_at_actor: true,
                                                    type: "minecraft:evocation_fang",
                                                    spell: {
                                                        id: magicFunction.distanceTarget,
                                                        modifier: {
                                                            distance: 1.5,
                                                            exclude_families: [ "inanimate" ],
                                                            impact: {
                                                                id: magicFunction.sourceTest,
                                                                modifier: {
                                                                    exclude_types: [ "minecraft:evocation_fang" ],
                                                                    spell: {
                                                                        id: magicFunction.setFire,
                                                                        modifier: {
                                                                            strength: 5
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castRotatedSpell,
                                        modifier: {
                                            count: 8,
                                            degree: 360,
                                            axis: "y",
                                            reset_axis: "x",
                                            spell: {
                                                id: magicFunction.castSpellOrb,
                                                modifier: {
                                                    type: "amw:magic_orb_dummy",
                                                    power: 0.5,
                                                    duration: 10,
                                                    ongoing: {
                                                        id: magicFunction.summonAtFloor,
                                                        delay: 2,
                                                        modifier: {
                                                            do_not_spawn_at_actor: true,
                                                            type: "minecraft:evocation_fang",
                                                            spell: {
                                                                id: magicFunction.distanceTarget,
                                                                modifier: {
                                                                    distance: 1.5,
                                                                    exclude_families: [ "inanimate" ],
                                                                    impact: {
                                                                        id: magicFunction.sourceTest,
                                                                        modifier: {
                                                                            exclude_types: [ "minecraft:evocation_fang" ],
                                                                            spell: {
                                                                                id: magicFunction.setFire,
                                                                                modifier: {
                                                                                    strength: 5
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "fang_buffer": {
        name: "Fang Buffer",
        path: "textures/ui/magic_list/fang_buffer",
        attribute: [ "creation", "conjuration", "dark" ],
        grade: "advance",
        type: "summon",
        cast_duration: 30,
        soul_cost: 14,
        function: magicFunction.castSpellAtView,
        modifier: {
            distance: 32,
            create_new_source: true,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.castCooldown,
                            modifier: {
                                target: "actor",
                                cooldown_spell: "fang_buffer",
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "dark_magic",
                                            multiply: -10,
                                            additive: 300
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:area_circle",
                                offset: {
                                    x: 0,
                                    y: 0.01,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "data",
                                        data: {
                                            x: 8,
                                            y: 15,
                                            z: 30
                                        }
                                    },
                                    {
                                        name: "data_2",
                                        data: {
                                            x: 0,
                                            y: 0,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.9,
                                            green: 0.86,
                                            blue: 1.0,
                                            alpha: 0.5
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:area_circle_blend",
                                offset: {
                                    x: 0,
                                    y: 0.01,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "data",
                                        data: {
                                            x: 8,
                                            y: 15,
                                            z: 30
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.9,
                                            green: 0.86,
                                            blue: 1.0,
                                            alpha: 0.5
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 299,
                                delay: 15,
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 8,
                                        include_actor: false,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.sourceTest,
                                            modifier: {
                                                exclude_types: [ "minecraft:evocation_fang" ],
                                                spell: {
                                                    id: magicFunction.createSourceDummy,
                                                    modifier: {
                                                        spell: {
                                                            id: magicFunction.sequenceCast,
                                                            modifier: {
                                                                delay: 9,
                                                                spell: [
                                                                    {
                                                                        id: magicFunction.createCircleBlastFromSource,
                                                                        modifier: {
                                                                            r: 0.9,
                                                                            g: 0.86,
                                                                            b: 1,
                                                                            a: 0.5,
                                                                            size: 1,
                                                                            duration: 1,
                                                                            offset: {x: 0, y: 0.2, z: 0}
                                                                        }
                                                                    },
                                                                    {
                                                                        id: magicFunction.summonAtFloor,
                                                                        modifier: {
                                                                            type: "minecraft:evocation_fang"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Create an area that can summon evoker fang at near area for 30 seconds."
    },
    "wind_blows": {
        name: "Wind Blows",
        path: "textures/ui/magic_list/wind_blows",
        attribute: [ "transmutation", "conjuration", "wind" ],
        grade: "basic",
        type: "action",
        cast_duration: 6,
        soul_cost: 8,
        function: magicFunction.distanceTarget,
        modifier: {
            include_actor: true,
            include_source: true,
            distance: 4,
            impact: {
                id: magicFunction.windBlows,
                modifier: {
                    power: {
                        magic_attributes: [
                            {
                                magic_type: "wind_magic",
                                multiply: 0.2,
                                additive: 2
                            }
                        ]
                    }
                }
            }
        },
        description: "Launch yourself and target."
    },
    "wind_projectile": {
        name: "Wind Projectile",
        path: "textures/ui/magic_list/wind_projectile",
        attribute: [ "transmutation", "wind" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 15,
        soul_cost: 28,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<wind_orb>",
            power: {
                magic_attributes: [
                    {
                        magic_type: "wind_magic",
                        multiply: 0.1,
                        additive: 0.5
                    }
                ]
            },
            duration: 40,
            impact: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:magic_swirl",
                                offset: {
                                    x: 0,
                                    y: 1,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "modifier",
                                        data: {
                                            x: 4,
                                            y: 0.4,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "color",
                                        data: {
                                            red: 0.65,
                                            green: 1.0,
                                            blue: 0.75,
                                            alpha: 1.0
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id:  magicFunction.distanceTarget,
                            modifier: {
                                distance: {
                                    magic_attributes: [
                                        {
                                            magic_type: "wind_magic",
                                            multiply: 0.33,
                                            additive: 3
                                        }
                                    ]
                                },
                                impact: {
                                    id: magicFunction.setKnockbackToTarget,
                                    modifier: {
                                        target: "source",
                                        offset: { x: 0, y: -2, z: 0 },
                                        inverse: true,
                                        strength: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "wind_magic",
                                                    multiply: 0.1,
                                                    additive: 0.8
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "orb_of_thunder": {
        name: "Orb Of Thunder",
        path: "textures/ui/magic_list/thunder_orb",
        attribute: [ "transmutation", "thunder" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 15,
        soul_cost: 28,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<hard_thunder_orb>",
            power: 0.15,
            duration: 200,
            ongoing: {
                id: magicFunction.distanceTarget,
                delay: 10,
                exclude_families: [ "inanimate" ],
                modifier: {
                    distance: 8,
                    impact: {
                        id: magicFunction.thunderStreak,
                        modifier: {
                            strength: {
                                magic_attributes: [
                                    {
                                        magic_type: "thunder_magic",
                                        multiply: 0.5,
                                        additive: 1
                                    }
                                ]
                            }
                        }
                    }
        
                }
            }
        },
        description: "Create a thunder orb. Thunder orb can strike a thunder to targets within an 8 blocks radius."
    },
    "blast_force": {
        name: "Blast Force",
        path: "textures/ui/magic_list/blast_force",
        attribute: [ "transmutation", "destruction" , "light", "void"],
        grade: "expert",
        type: "create",
        cast_duration: 44,
        soul_cost: 53,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castSpellInlineView,
                    modifier: {
                        distance: 32,
                        deadzone: 3,
                        gap: 0.5,
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.explosion,
                                        modifier: {
                                            radius: 2,
                                            break: true,
                                            underwater: true
                                        }
                                    },
                                    {
                                        id: magicFunction.distanceTarget,
                                        modifier: {
                                            distance: 3,
                                            impact: {
                                                id: magicFunction.damageToSource,
                                                modifier: {
                                                    strength: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "light_magic",
                                                                multiply: 2,
                                                                additive: 15
                                                            },
                                                            {
                                                                magic_type: "void_magic",
                                                                multiply: 2,
                                                                additive: 0
                                                            }
                                                        ]
                                                    },
                                                    from: "actor"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    id: magicFunction.createParticleSourceToTarget,
                    modifier: {
                        particle: "magic:blast_force_effect",
                        distance: 32
                    }
                }
            ]
        },
        description: "Conjure a blast force that destroy block and damaging entity in near inline target."
    },
    "frostbite": {
        name: "Frostbite",
        path: "textures/ui/magic_list/frostbite",
        attribute: [ "conjuration", "ice"],
        grade: "intermediate",
        type: "action",
        cast_duration: 22,
        soul_cost: 43,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "ice_magic",
                        multiply: 80,
                        additive: 120
                    }
                ]
            },
            enable_cooldown: true,
            delay: 4,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.castSpellInlineView,
                            modifier: {
                                distance: 6,
                                deadzone: 0.5,
                                gap: 0.5,
                                spell: {
                                    id: magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 3,
                                        exclude_families: [ "inanimate" ],
                                        impact: {
                                            id: magicFunction.setFreeze,
                                            modifier: {
                                                type: "stunt",
                                                duration: {
                                                    magic_attributes: [
                                                        {
                                                            magic_type: "ice_magic",
                                                            multiply: 90,
                                                            additive: 90
                                                        }
                                                    ]
                                                },
                                                strength: {
                                                    to_int: true,
                                                    magic_attributes: [
                                                        {
                                                            magic_type: "ice_magic",
                                                            multiply: 0.25,
                                                            additive: 0.1
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.createParticleSourceToTarget,
                            modifier: {
                                particle: "magic:frostbite",
                                distance: 4,
                                start_distance: 0.5
                            }
                        },
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:spreading_particle",
                                offset: {
                                    x: 0,
                                    y: 1.5,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "spread_curve",
                                        data: 1.0
                                    },
                                    {
                                        name: "duration_speed_density",
                                        data: {
                                            x: 3,
                                            y: 2,
                                            z: 3
                                        }
                                    },
                                    {
                                        name: "direction",
                                        data: "view"
                                    },
                                    {
                                        name: "offset_and_size",
                                        data: {
                                            x: 0,
                                            y: 0,
                                            z: 0.1
                                        }
                                    },
                                    {
                                        name: "gap_and_frame",
                                        data: {
                                            x: 8,
                                            y: 0,
                                            z: 7
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "blink": {
        name: "Blink",
        path: "textures/ui/magic_list/blink",
        attribute: [ "conjuration", "void" ],
        grade: "basic",
        type: "action",
        cast_duration: 6,
        soul_cost: 11,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: {
                magic_attributes: [
                    {
                        magic_type: "void_magic",
                        multiply: 1,
                        additive: 12
                    }
                ]
            },
            impact: {
                id: magicFunction.teleport,
                modifier: {
                }
            }
        },
        description: "Teleport yourself at view directions within 16 block distance."
    },
    "swap_teleportation": {
        name: "Swap Teleportation",
        path: "textures/ui/magic_list/swap_teleportation",
        attribute: [ "conjuration", "void" ],
        grade: "advance",
        type: "action",
        cast_duration: 26,
        soul_cost: 31,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: {
                magic_attributes: [
                    {
                        magic_type: "void_magic",
                        multiply: 8,
                        additive: 10
                    }
                ]
            },
            impact: {
                id: magicFunction.distanceTarget,
                modifier: {
                    distance: 4,
                    include_source: true,
                    single_scan: true,
                    exclude_families: [ "inanimate" ],
                    impact: {
                        id: magicFunction.swapLocation,
                        modifier: {
                            from: "actor",
                            to: "self"
                        }
                    }
                }
            }
        },
        description: ""
    },
    "alternate_damage": {
        name: "Alternate Damage",
        path: "textures/ui/magic_list/alternate_damage",
        attribute: [ "conjuration", "dark" ],
        grade: "advance",
        type: "curse",
        cast_duration: 34,
        soul_cost: 41,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<dark_orb>",
            power: {
                magic_attributes: [
                    {
                        magic_type: "dark_magic",
                        multiply: 0.2,
                        additive: 0.6
                    }
                ]
            },
            duration: 80,
            particles: "minecraft:mob_portal",
            impact: {
                id: magicFunction.distanceTarget,
                modifier: {
                    single_scan: true,
                    distance: 3,
                    impact: {
                        id: magicFunction.sequenceCast,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.castCooldown,
                                    modifier: {
                                        cooldown_spell: "alternate_damage",
                                        duration: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "dark_magic",
                                                    multiply: -10,
                                                    additive: 300
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.setupVoodoo,
                                    modifier: {}
                                },
                                {
                                    id: magicFunction.castAtActor,
                                    modifier: {
                                        spell: {
                                            id: magicFunction.castSpellAtView,
                                            modifier: {
                                                range: 3,
                                                create_new_source: true,
                                                impact: {
                                                    id: magicFunction.castMultipleSpell,
                                                    modifier: {
                                                        spell: [
                                                            {
                                                                id: magicFunction.createParticle,
                                                                modifier: {
                                                                    particle: "magic:pop_effect",
                                                                    data: [
                                                                        {
                                                                            name: "color",
                                                                            data: {
                                                                                red: 0.35,
                                                                                green: 0.22,
                                                                                blue: 0.1,
                                                                                alpha: 1
                                                                            }
                                                                        },
                                                                        {
                                                                            name: "modifier",
                                                                            data: {
                                                                                x: 1,
                                                                                y: 20,
                                                                                z: 0.6
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            },
                                                            {
                                                                id: magicFunction.summonVoodooTarget,
                                                                modifier: {
                                                                    strength: 0.7,
                                                                    duration: 300,
                                                                    spell: {
                                                                        id: magicFunction.burstCast,
                                                                        modifier: {
                                                                            duration: 300,
                                                                            spell: {
                                                                                id: magicFunction.createLineSpellActorToSource,
                                                                                modifier: {
                                                                                    r: 1,
                                                                                    g: 0.92,
                                                                                    b: 0.84,
                                                                                    start: "self",
                                                                                    end: "source"
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: "Create a puppet that can transter damage to selected entities."
    },
    "teleport": {
        name: "Teleport",
        path: "textures/ui/magic_list/teleport",
        attribute: [ "conjuration", "void" ],
        grade: "advance",
        type: "action",
        cast_duration: 66,
        soul_cost: 20,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.createCircleBlastFromSource,
                    modifier: {
                        r: 0.4,
                        g: 0.2,
                        b: 0.8,
                        a: 0.5,
                        size: 1,
                        duration: 1,
                        offset: {x: 0, y: 0.1, z: 0}
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 256,
                        set_to_floor: true,
                        impact: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.sequenceCast,
                                        modifier: {
                                            delay: 20,
                                            spell: [
                                                {
                                                    id: magicFunction.limitMovementCooldown,
                                                    modifier: {
                                                        duration: 20
                                                    }
                                                },
                                                {
                                                    id: magicFunction.teleport,
                                                    modifier: {
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: magicFunction.createBoxParticleFromSource,
                                        modifier: {
                                            size: 2,
                                            duration: 20,
                                            height: 5,
                                            r: 0.15,
                                            g: 0.06,
                                            b: 0.38,
                                            a: 0.88
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        description: "Teleport yourself at view directions within 256 block distance."
    },
    "warp": {
        name: "Warp",
        path: "textures/ui/magic_list/warp",
        attribute: [ "conjuration", "void" ],
        grade: "expert",
        type: "action",
        cast_duration: 76,
        soul_cost: 66,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "warp_control",
                        restart_cluster: true,
                        duration: 100
                    }
                },
                {
                    id: magicFunction.createSourceDummy,
                    modifier: {
                        spell: {
                            id: magicFunction.sequenceCast,
                            modifier: {
                                delay: 95,
                                start_delay: true,
                                spell: [
                                    {
                                        id: magicFunction.distanceTarget,
                                        modifier: {
                                            distance: 4,
                                            include_actor: true,
                                            include_source: true,
                                            impact: {
                                                id: magicFunction.addSingleScanEntity,
                                                modifier: {
                                                    cluster_name: "warp_control",
                                                    duration: 5
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    id: magicFunction.createParticle,
                    modifier: {
                        particle: "magic:area_circle_blend",
                        offset: {
                            x: 0,
                            y: 0.01,
                            z: 0
                        },
                        data: [
                            {
                                name: "data",
                                data: {
                                    x: 4,
                                    y: 5,
                                    z: 31
                                }
                            },
                            {
                                name: "color",
                                data: {
                                    red: 0.6,
                                    green: 0.77,
                                    blue: 1.0,
                                    alpha: 0.5
                                }
                            }
                        ]
                    }
                },
                {
                    id: magicFunction.createParticle,
                    modifier: {
                        particle: "magic:area_circle",
                        offset: {
                            x: 0,
                            y: 0.01,
                            z: 0
                        },
                        data: [
                            {
                                name: "data",
                                data: {
                                    x: 4,
                                    y: 5,
                                    z: 31
                                }
                            },
                            {
                                name: "data_2",
                                data: {
                                    x: 0,
                                    y: 0,
                                    z: 0
                                }
                            },
                            {
                                name: "color",
                                data: {
                                    red: 0.19,
                                    green: 0.47,
                                    blue: 0.84,
                                    alpha: 1
                                }
                            }
                        ]
                    }
                },
                {
                    id: magicFunction.createCircleBlastFromSource,
                    modifier: {
                        r: 0.5,
                        g: 0.63,
                        b: 1.0,
                        a: 0.4,
                        size: 4,
                        duration: 5,
                        offset: {x: 0, y: 0.01, z: 0}
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 256,
                        set_to_floor: true,
                        impact: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.sequenceCast,
                                        modifier: {
                                            delay: 98,
                                            start_delay: true,
                                            spell: [
                                                {
                                                    id: magicFunction.castAtScanEntity,
                                                    modifier: {
                                                        cluster_name: "warp_control",
                                                        spell: {
                                                            id: magicFunction.teleportToTarget,
                                                            modifier: {
                                                                head_location: false,
                                                                use_rotation: true
                                                            }
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: magicFunction.createParticle,
                                        modifier: {
                                            particle: "magic:area_circle_blend",
                                            offset: {
                                                x: 0,
                                                y: 0.01,
                                                z: 0
                                            },
                                            data: [
                                                {
                                                    name: "data",
                                                    data: {
                                                        x: 1,
                                                        y: 5,
                                                        z: 31
                                                    }
                                                },
                                                {
                                                    name: "color",
                                                    data: {
                                                        red: 0.6,
                                                        green: 0.77,
                                                        blue: 1.0,
                                                        alpha: 0.5
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: magicFunction.createParticle,
                                        modifier: {
                                            particle: "magic:area_circle",
                                            offset: {
                                                x: 0,
                                                y: 0.01,
                                                z: 0
                                            },
                                            data: [
                                                {
                                                    name: "data",
                                                    data: {
                                                        x: 1,
                                                        y: 5,
                                                        z: 31
                                                    }
                                                },
                                                {
                                                    name: "data_2",
                                                    data: {
                                                        x: 0,
                                                        y: 0,
                                                        z: 0
                                                    }
                                                },
                                                {
                                                    name: "color",
                                                    data: {
                                                        red: 0.19,
                                                        green: 0.47,
                                                        blue: 0.84,
                                                        alpha: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: magicFunction.createBoxParticleFromSource,
                                        modifier: {
                                            size: 1.25,
                                            duration: 100,
                                            height: 2,
                                            r: 0.19,
                                            g: 0.47,
                                            b: 0.84,
                                            a: 0.5
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "chaining_tnt": {
        name: "Chaining TNT",
        path: "textures/ui/magic_list/chaining_tnt",
        attribute: [ "transmutation", "nature", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 16,
        soul_cost: 31,
        function: magicFunction.castProjectile,
        modifier: {
            type: "minecraft:tnt",
            power: 1.1,
            spell: {
                id: magicFunction.sequenceCast,
                modifier: {
                    delay : 75,
                    start_delay: true,
                    spell: [
                        {
                            id: magicFunction.createSourceDummy,
                            modifier: {
                                spell: {
                                    id: magicFunction.sequenceCast,
                                    modifier: {
                                        delay : 5,
                                        spell: [
                                            {
                                                id: magicFunction.createCircleBlastFromSource,
                                                modifier: {
                                                    r: 1.0,
                                                    g: 0.4,
                                                    b: 0.2,
                                                    a: 0.7,
                                                    size: 6,
                                                    duration: 0.3,
                                                    offset: {x: 0, y: 0.5, z: 0}
                                                }
                                            },
                                            {
                                                id: magicFunction.castRotatedSpell,
                                                modifier: {
                                                    degree: -65,
                                                    distance: 1,
                                                    axis: "x",
                                                    reset_axis: "x",
                                                    spell: {
                                                        id: magicFunction.castRotatedSpell,
                                                        modifier: {
                                                            count: 4,
                                                            degree: 270,
                                                            distance: 1,
                                                            axis: "y",
                                                            spell: {
                                                                id: magicFunction.castProjectile,
                                                                modifier: {
                                                                    type: "minecraft:tnt",
                                                                    power: 0.01,
                                                                    spell: {
                                                                        id: magicFunction.sequenceCast,
                                                                        modifier: {
                                                                            delay : 75,
                                                                            start_delay: true,
                                                                            spell: [
                                                                                {
                                                                                    id: magicFunction.createCircleBlastFromSource,
                                                                                    modifier: {
                                                                                        r: 1.0,
                                                                                        g: 0.4,
                                                                                        b: 0.2,
                                                                                        a: 0.7,
                                                                                        size: 6,
                                                                                        duration: 0.3,
                                                                                        offset: {x: 0, y: 0.5, z: 0}
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "exploding_tnt": {
        name: "Exploding TNT",
        path: "textures/ui/magic_list/exploding_tnt",
        attribute: [ "transmutation", "nature", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 20,
        soul_cost: 18,
        function: magicFunction.castProjectile,
        modifier: {
            type: "minecraft:tnt",
            power: 1.1,
            spell: {
                id: magicFunction.sequenceCast,
                modifier: {
                    delay : 80,
                    start_delay: true,
                    spell: [
                        {
                            id: magicFunction.createCircleBlastFromSource,
                            modifier: {
                                r: 1.0,
                                g: 0.4,
                                b: 0.2,
                                a: 0.7,
                                size: 6,
                                duration: 0.3,
                                offset: {x: 0, y: 0.5, z: 0}
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "convert_soul": {
        name: "Convert Soul",
        path: "textures/ui/magic_list/convert_soul",
        attribute: [ "restoration", "light" ],
        grade: "advance",
        type: "action",
        cast_duration: 10,
        soul_cost: 0,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "light_magic",
                        multiply: 10,
                        additive: 100
                    }
                ]
            },
            delay: 4,
            enable_cooldown: true,
            spell: {
                id: magicFunction.convertSoul,
                modifier: {
                }
            }
        },
        description: "Transfer your exp to souls."
    },
    "light_beam": {
        name: "Light Beam",
        path: "textures/ui/magic_list/light_beam",
        attribute: [ "transmutation", "light" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 20,
        function: magicFunction.castWhenCharging,
        modifier: {
            action_type: "hold",
            duration: {
                magic_attributes: [
                    {
                        magic_type: "light_magic",
                        multiply: 20,
                        additive: 100
                    }
                ]
            },
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.playAnimation,
                            modifier: {
                                animation: "animation.item_hand.center_pull",
                                controller: "pulling_controller"
                            }
                        },
                        {
                            id: magicFunction.castSpellAtView,
                            modifier: {
                                range: {
                                    magic_attributes: [
                                        {
                                            magic_type: "light_magic",
                                            multiply: 16,
                                            additive: 32
                                        }
                                    ]
                                },
                                impact: {
                                    id: magicFunction.lightBeam,
                                    modifier: {
                                        strength: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "light_magic",
                                                    multiply: 1,
                                                    additive: 2
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: "Conjures a light beam in terget directions for 5 seconds."
    },
    "poltergeist": {
        name: "Poltergeist",
        path: "textures/ui/magic_list/poltergeist",
        attribute: [ "conjuration", "void" ],
        grade: "advance",
        type: "action",
        cast_duration: 25,
        soul_cost: 40,
        function: magicFunction.castSpellOrb,
        modifier: {
            type: "amw:magic_orb<void_orb>",
            power: 0.9,
            duration: 40,
            particles: "minecraft:mob_portal",
            impact: {
                id: magicFunction.poltergeist,
                modifier: {
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "void_magic",
                                multiply: 40,
                                additive: 200
                            }
                        ]
                    }
                }
            }
        },
        description: "Controling the target for 10 seconds."
    },
    "tornado": {
        name: "Tornado",
        path: "textures/ui/magic_list/tornado",
        attribute: [ "transmutation", "wind", "nature" ],
        grade: "basic",
        type: "create",
        cast_duration: 15,
        soul_cost: 12,
        function: magicFunction.castSpellLinear,
        modifier: {
            type: "amw:tornado",
            power: 0.3,
            duration: 70,
            ongoing: {
                id: magicFunction.swirl,
                delay: 0,
                modifier: {
                }
            }
        },
        description: "Create a tornado that can launch target."
    },
    "thundering_arrow": {
        name: "Thundering Arrow",
        path: "textures/ui/magic_list/thundering_arrow",
        attribute: [ "conjuration", "thunder" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_arrow<absolute>",
            power: 2.9,
            despawn: 200,
            spell: {
                id: magicFunction.projectileHitCast,
                modifier: {
                    impact: {
                        id: magicFunction.sequenceCast,
                        modifier: {
                            delay: 5,
                            enable_cooldown: false,
                            spell: [
                                {
                                    id: magicFunction.createCircleBlastFromSource,
                                    modifier: {
                                        r: 1,
                                        g: 1,
                                        b: 1,
                                        a: 0.5,
                                        size: 3,
                                        duration: 0.4,
                                        offset: {x: 0, y: 0.2, z: 0}
                                    }
                                },
                                {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.lightning,
                                                modifier: {
                                                }
                                            },
                                            {
                                                id: magicFunction.setCameraShake,
                                                modifier: {
                                                    radius: 16,
                                                    duration: 10,
                                                    strength: 0.1
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: ""
    },
    "ice_glace": {
        name: "Ice Glace",
        path: "textures/ui/magic_list/ice_glace",
        attribute: [ "conjuration", "ice" ],
        grade: "advance",
        type: "create",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "ice_glace",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "ice_magic",
                                    multiply: -10,
                                    additive: 150
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: {
                            magic_attributes: [
                                {
                                    magic_type: "ice_magic",
                                    multiply: 16,
                                    additive: 32
                                }
                            ]
                        },
                        create_new_source: true,
                        impact: {
                            id: magicFunction.distanceTarget,
                            modifier: {
                                distance: 4,
                                single_scan: true,
                                impact: {
                                    id: magicFunction.summonAtLocation,
                                    modifier: {
                                        type: "amw:ice_chunk",
                                        despawn: 300,
                                        offset: { x: 0, y: 3, z: 0},
                                        source_target: "self",
                                        spell: {
                                            id: magicFunction.burstCast,
                                            modifier: {
                                                duration: 280,
                                                enable_cooldown: false,
                                                can_cancel: false,
                                                force_slot: false,
                                                spell: {
                                                    id: magicFunction.setKnockbackToTarget,
                                                    modifier: {
                                                        target: "source",
                                                        offset: { x: 0, y: 3, z: 0 },
                                                        strength: 0.25
                                                    }
                                                },
                                                stop_spell: {
                                                    id: magicFunction.sequenceCast,
                                                    modifier: {
                                                        delay: 5,
                                                        spell: [
                                                            {
                                                                id: magicFunction.playAnimation,
                                                                modifier: {
                                                                    animation: "animation.ice_chunk.slam",
                                                                    controller: "slamming_controller"
                                                                }
                                                            },
                                                            {
                                                                id: magicFunction.setKnockbackToTarget,
                                                                modifier: {
                                                                    target: "self",
                                                                    offset: { x: 0, y: -1, z: 0 },
                                                                    strength: 10
                                                                }
                                                            },
                                                            {
                                                                id: magicFunction.distanceTarget,
                                                                modifier: {
                                                                    distance: 3,
                                                                    impact: {
                                                                        id: magicFunction.castMultipleSpell,
                                                                        modifier: {
                                                                            spell: [
                                                                                {
                                                                                    id: magicFunction.setKnockbackToTarget,
                                                                                    modifier: {
                                                                                        target: "self",
                                                                                        offset: { x: 0, y: 1, z: 0 },
                                                                                        strength: 0.5
                                                                                    }
                                                                                },
                                                                                {
                                                                                    id: magicFunction.damageToSource,
                                                                                    modifier: {
                                                                                        strength: {
                                                                                            magic_attributes: [
                                                                                                {
                                                                                                    magic_type: "ice_magic",
                                                                                                    multiply: 1,
                                                                                                    additive: 1
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "gravity_pull_arrow": {
        name: "Gravity Pull Arrow",
        path: "textures/ui/magic_list/gravity_pull_arrow",
        attribute: [ "manipulation", "void" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_arrow",
            power: 2.9,
            despawn: 200,
            spell: {
                id: magicFunction.projectileHitCast,
                modifier: {
                    create_new_source: true,
                    impact: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.createParticle,
                                    modifier: {
                                        particle: "magic:animated_plane_circle",
                                        offset: {
                                            x: 0,
                                            y: 0.5,
                                            z: 0
                                        },
                                        data: [
                                            {
                                                name: "size",
                                                data: 4
                                            },
                                            {
                                                name: "offset",
                                                data: {
                                                    x: 0,
                                                    y: 31,
                                                    z: 0
                                                }
                                            },
                                            {
                                                name: "animation_and_duration",
                                                data: {
                                                    x: 1,
                                                    y: -1,
                                                    z: 0.75
                                                }
                                            },
                                            {
                                                name: "frame",
                                                data: {
                                                    x: 7,
                                                    y: 31,
                                                    z: 0
                                                }
                                            },
                                            {
                                                name: "color_from",
                                                data: {
                                                    red: 0.46,
                                                    green: 0.24,
                                                    blue: 1.0,
                                                    alpha: 1.0
                                                }
                                            },
                                            {
                                                name: "color_to",
                                                data: {
                                                    red: 1.0,
                                                    green: 1.0,
                                                    blue: 1.0,
                                                    alpha: 1.0
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    id:  magicFunction.burstCast,
                                    modifier: {
                                        duration: 20,
                                        enable_cooldown: false,
                                        can_cancel: false,
                                        force_slot: false,
                                        spell: {
                                            id:  magicFunction.distanceTarget,
                                            modifier: {
                                                distance: 4,
                                                impact: {
                                                    id: magicFunction.setKnockbackToTarget,
                                                    modifier: {
                                                        target: "source",
                                                        offset: { x: 0, y: -1, z: 0 },
                                                        strength: 1.25
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: ""
    },
    "explosive_arrow": {
        name: "Explosive Arrow",
        path: "textures/ui/magic_list/explosive_arrow",
        attribute: [ "destruction", "fire" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_arrow",
            power: 2.9,
            despawn: 200,
            spell: {
                id: magicFunction.projectileHitCast,
                modifier: {
                    create_new_source: true,
                    impact: {
                        id: magicFunction.sequenceCast,
                        modifier: {
                            delay : 3,
                            spell: [
                                {
                                    id: magicFunction.createCircleBlastFromSource,
                                    modifier: {
                                        r: 1.0,
                                        g: 0.4,
                                        b: 0.2,
                                        a: 0.7,
                                        size: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "fire_magic",
                                                    multiply: 0.5,
                                                    additive: 3
                                                }
                                            ]
                                        },
                                        duration: 0.3,
                                        offset: {x: 0, y: 0.5, z: 0}
                                    }
                                },
                                {
                                    id: magicFunction.explosion,
                                    modifier: {
                                        radius: {
                                            to_int: true,
                                            magic_attributes: [
                                                {
                                                    magic_type: "fire_magic",
                                                    multiply: 0.5,
                                                    additive: 3
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: ""
    },
    "healing_arrow": {
        name: "Healing Arrow",
        path: "textures/ui/magic_list/healing_arrow",
        attribute: [ "restoration", "light" ],
        grade: "intermediate",
        type: "enchace",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_arrow",
            power: 2.9,
            despawn: 200,
            spell: {
                id: magicFunction.projectileHitCast,
                modifier: {
                    create_new_source: true,
                    impact: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.burstCast,
                                    modifier: {
                                        duration: 100,
                                        delay: 4,
                                        enable_cooldown: false,
                                        spell: {
                                            id: magicFunction.distanceTarget,
                                            modifier: {
                                                distance: {x: 8, y: 8, z: 8},
                                                include_actor: true,
                                                include_source: true,
                                                exclude_families: [ "monster" ],
                                                impact: {
                                                    id: magicFunction.healing,
                                                    modifier: {
                                                        strength: {
                                                            magic_attributes: [
                                                                {
                                                                    magic_type: "light_magic",
                                                                    multiply: 0.3,
                                                                    additive: 0.3
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 5,
                                        duration: 100,
                                        height: 2,
                                        r: 0.43,
                                        g: 1,
                                        b: 0.73,
                                        a: 0.5
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 3,
                                        duration: 100,
                                        height: 1.5,
                                        r: 0.43,
                                        g: 1,
                                        b: 0.73,
                                        a: 0.3
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 1,
                                        duration: 100,
                                        height: 0.5,
                                        r: 0.43,
                                        g: 1,
                                        b: 0.73,
                                        a: 0.25
                                    }
                                },
                                {
                                    id: magicFunction.createBoxParticleFromSource,
                                    modifier: {
                                        size: 0.5,
                                        duration: 100,
                                        height: 2.5,
                                        r: 0.43,
                                        g: 1,
                                        b: 0.73,
                                        a: 0.5
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        description: ""
    },
    "gusting_arrow": {
        name: "Gusting Arrow",
        path: "textures/ui/magic_list/gusting_arrow",
        attribute: [ "conjuration", "wind" ],
        grade: "intermediate",
        type: "create",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_arrow<absolute>",
            power: 2.9,
            despawn: 200,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.changeProjectileComponents,
                            modifier: {
                                gravity: 0.0,
                                speed: 0.15,
                                air_inertia: 1.0,
                                liquid_inertia: 1.0,
                                destroy_on_projectile_hurt: false,
                                stop_on_hit: false
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 200,
                                enable_cooldown: false,
                                can_cancel: false,
                                force_slot: false,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: 7,
                                                    deadzone: 3,
                                                    impact: {
                                                        id: magicFunction.setKnockbackToTarget,
                                                        modifier: {
                                                            target: "source",
                                                            multiplier: 0.5
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.createParticle,
                                                modifier: {
                                                    particle: "magic:wind_circle_effect",
                                                    data: [
                                                        {
                                                            name: "direction",
                                                            data: "velocity"
                                                        },
                                                        {
                                                            name: "size",
                                                            data: 5
                                                        },
                                                        {
                                                            name: "time",
                                                            data: 1
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                
                                                id: magicFunction.sourceTest,
                                                modifier: {
                                                    velocity: {
                                                        operator: "<",
                                                        value: 0.01
                                                    },
                                                    spell: {
                                                        id: magicFunction.stopCast,
                                                        modifier: {}
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "scorching_shoot": {
        name: "Scorching Shoot",
        path: "textures/ui/magic_list/scorching_shoot",
        attribute: [ "conjuration", "fire" ],
        grade: "advance",
        type: "create",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.afterProjectileCast,
        modifier: {
            count: {
                magic_attributes: [
                    {
                        magic_type: "fire_magic",
                        multiply: 0.5,
                        additive: 1
                    }
                ]
            },
            enable_cooldown: true,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.changeProjectileComponents,
                            modifier: {
                                speed: 0.5,
                                destroy_on_projectile_hurt: false,
                                stop_on_hit: false,
                                crit_particles_on_projectile_hurt: true
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 200,
                                enable_cooldown: false,
                                can_cancel: false,
                                force_slot: false,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: 7,
                                                    impact: {
                                                        id: magicFunction.setFire,
                                                        modifier: {
                                                            strength: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "fire_magic",
                                                                        multiply: 1,
                                                                        additive: 2
                                                                    }
                                                                ]
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.createParticle,
                                                modifier: {
                                                    particle: "magic:fireball_effect",
                                                    data: []
                                                }
                                            },
                                            {
                                                
                                                id: magicFunction.sourceTest,
                                                modifier: {
                                                    velocity: {
                                                        operator: "<",
                                                        value: 0.01
                                                    },
                                                    spell: {
                                                        id: magicFunction.stopCast,
                                                        modifier: {}
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "armadillo_spinner": {
        name: "Armadillo Spinner",
        path: "textures/ui/magic_list/armadillo_spinner",
        attribute: [ "creation", "nature" ],
        grade: "advance",
        type: "summon",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:armadillo_projectile",
            power: 1.0,
            despawn: 400,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.setBounceProjectile,
                            modifier: {}
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 200,
                                enable_cooldown: false,
                                can_cancel: false,
                                force_slot: false,
                                spell: {   
                                    id: magicFunction.sourceTest,
                                    modifier: {
                                        velocity: {
                                            operator: ">",
                                            value: 0.01
                                        },
                                        spell: {
                                            id: magicFunction.distanceTarget,
                                            modifier: {
                                                distance: 2,
                                                impact: {
                                                    id: magicFunction.castMultipleSpell,
                                                    modifier: {
                                                        spell: [
                                                            {
                                                                id: magicFunction.damageToSource,
                                                                modifier: {
                                                                    strength: 2
                                                                }
                                                            },
                                                            {
                                                                id: magicFunction.setKnockbackToTarget,
                                                                modifier: {
                                                                    target: "source",
                                                                    inverse: true,
                                                                    multiplier: 4
                                                                }
                                                            }
                                                        ]
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "targeting_shoot": {
        name: "Targeting Shoot",
        path: "textures/ui/magic_list/targeting_shoot",
        attribute: [ "manipulation", "void" ],
        grade: "advance",
        type: "curse",
        cast_duration: 10,
        soul_cost: 17,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "targeting_shoot",
                        restart_cluster: true,
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "void_magic",
                                    multiply: 80,
                                    additive: 150
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtView,
                    modifier: {
                        range: 64,
                        impact: {
                            id: magicFunction.distanceTarget,
                            modifier: {
                                distance: 3,
                                single_scan: true,
                                include_source: true,
                                impact: {
                                    id: magicFunction.addSingleScanEntity,
                                    modifier: {
                                        cluster_name: "targeting_shoot"
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    id: magicFunction.castAtScanEntity,
                    modifier: {
                        cluster_name: "targeting_shoot",
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.castCooldown,
                                        modifier: {
                                            target: "actor",
                                            cooldown_spell: "targeting_shoot",
                                            duration: {
                                                magic_attributes: [
                                                    {
                                                        magic_type: "void_magic",
                                                        multiply: 80,
                                                        additive: 200
                                                    },
                                                    {
                                                        magic_type: "void_magic",
                                                        multiply: -16,
                                                        additive: 200
                                                    }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.castAtActor,
                                        modifier: {
                                            spell: {
                                                id: magicFunction.afterProjectileCast,
                                                modifier: {
                                                    count: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "void_magic",
                                                                multiply: 80,
                                                                additive: 145
                                                            }
                                                        ]
                                                    },
                                                    enable_cooldown: false,
                                                    ticking_duration: true,
                                                    can_cancel: false,
                                                    passthru_source: true,
                                                    spell: {
                                                        id: magicFunction.burstCast,
                                                        modifier: {
                                                            duration: {
                                                                magic_attributes: [
                                                                    {
                                                                        magic_type: "void_magic",
                                                                        multiply: 80,
                                                                        additive: 145
                                                                    }
                                                                ]
                                                            },
                                                            delay: 4,
                                                            spell: {
                                                                id: magicFunction.castMultipleSpell,
                                                                modifier: {
                                                                    spell: [
                                                                        {
                                                                            id: magicFunction.setKnockbackToTarget,
                                                                            modifier: {
                                                                                target: "source",
                                                                                offset: {
                                                                                    x: 0,
                                                                                    y: 1,
                                                                                    z: 0
                                                                                }
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.castAtScanEntity,
                                                                            modifier: {
                                                                                cluster_name: "targeting_shoot",
                                                                                empty_spell: {
                                                                                    id: magicFunction.stopCast,
                                                                                    modifier: {}
                                                                                }
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.summonAtLocation,
                                        modifier: {
                                            type: "amw:targeting_placeholder",
                                            despawn: {
                                                magic_attributes: [
                                                    {
                                                        magic_type: "void_magic",
                                                        multiply: 80,
                                                        additive: 145
                                                    }
                                                ]
                                            },
                                            copy_rotation: false,
                                            spell: {
                                                id: magicFunction.burstCast,
                                                modifier: {
                                                    duration: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "void_magic",
                                                                multiply: 80,
                                                                additive: 140
                                                            }
                                                        ]
                                                    },
                                                    spell: {
                                                        id: magicFunction.castMultipleSpell,
                                                        modifier: {
                                                            spell: [
                                                                {
                                                                    id: magicFunction.playAnimation,
                                                                    modifier: {
                                                                        animation: "animation.general.invisible_root",
                                                                        show_to: "except_actor"
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.castAtScanEntity,
                                                                    modifier: {
                                                                        cluster_name: "targeting_shoot",
                                                                        empty_spell: {
                                                                            id: magicFunction.castMultipleSpell,
                                                                            modifier: {
                                                                                spell: [
                                                                                    {
                                                                                        id: magicFunction.despawnTarget,
                                                                                        modifier: {
                                                                                            target: "source"
                                                                                        }
                                                                                    },
                                                                                    {
                                                                                        id: magicFunction.stopCast,
                                                                                        modifier: {}
                                                                                    }
                                                                                ]
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.teleportToTarget,
                                                                    modifier: {
                                                                        use_rotation: false,
                                                                        offset: {
                                                                            x: 0, y: 1, z: 0
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "aqua_surfing": {
        name: "Aqua Surfing",
        path: "textures/ui/magic_list/aqua_surfing",
        attribute: [ "manipulation", "water" ],
        grade: "advance",
        type: "action",
        cast_duration: 20,
        soul_cost: 27,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "water_magic",
                        multiply: 200,
                        additive: 600
                    }
                ]
            },
            enable_cooldown: true,
            can_cancel: true,
            force_slot: false,
            spell: {   
                id: magicFunction.sourceTest,
                modifier: {
                    is_swimming: true,
                    spell: {
                        id: magicFunction.setKnockbackToTarget,
                        modifier: {
                            target: "view"
                        }
                    }
                }
            }
        },
        description: ""
    },
    "portals": {
        name: "Portals",
        path: "textures/ui/magic_list/portals",
        attribute: [ "creation", "void" ],
        grade: "advance",
        type: "action",
        cast_duration: 50,
        soul_cost: 46,
        function: magicFunction.castSpellInlineDistance,
        modifier: {
            range: 64,
            spell_from: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.castCooldown,
                            modifier: {
                                target: "actor",
                                cooldown_spell: "portals",
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "void_magic",
                                            multiply: 50,
                                            additive: 900
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            id: magicFunction.setupSingleScan,
                            modifier: {
                                cluster_name: "portal_red",
                                restart_cluster: true,
                                duration: 360
                            }
                        },
                        {
                            id: magicFunction.setupSingleScan,
                            modifier: {
                                cluster_name: "portal_blue",
                                restart_cluster: true,
                                duration: 360
                            }
                        },
                        {
                            id: magicFunction.setupSingleScan,
                            modifier: {
                                cluster_name: "portal_teleported",
                                restart_cluster: true,
                                duration: 360
                            }
                        },
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 350,
                                delay: 2,
                                enable_cooldown: false,
                                spell: {
                                    id: magicFunction.sequenceCast,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: {
                                                        x: 4,
                                                        y: 4,
                                                        z: 4
                                                    },
                                                    offset: {
                                                        x: 0,
                                                        y: 2,
                                                        z: 0
                                                    },
                                                    include_actor: true,
                                                    impact: {
                                                        id: magicFunction.castMultipleSpell,
                                                        modifier: {
                                                            spell: [
                                                                {
                                                                    id: magicFunction.sourceTest,
                                                                    modifier: {
                                                                        single_scan: {
                                                                            exclude: {
                                                                                name: [ "portal_teleported" ]
                                                                            }
                                                                        },
                                                                        spell: {
                                                                            id: magicFunction.addSingleScan,
                                                                            modifier: {
                                                                                cluster_name: "portal_teleported",
                                                                                duration: 20
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.sourceTest,
                                                                    modifier: {
                                                                        single_scan: {
                                                                            include: {
                                                                                name: [ "portal_teleported" ]
                                                                            }
                                                                        },
                                                                        spell: {
                                                                            id: magicFunction.addSingleScanEntity,
                                                                            modifier: {
                                                                                cluster_name: "portal_blue",
                                                                                duration: 3
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.castAtScanEntity,
                                                modifier: {
                                                    cluster_name: "portal_red",
                                                    spell: {
                                                        id: magicFunction.sourceTest,
                                                        modifier: {
                                                            single_scan: {
                                                                include: {
                                                                    name: [ "portal_teleported" ]
                                                                }
                                                            },
                                                            spell: {
                                                                id: magicFunction.castMultipleSpell,
                                                                modifier: {
                                                                    spell: [
                                                                        {
                                                                            id: magicFunction.removeSingleScanEntity,
                                                                            modifier: {
                                                                                cluster_name: "portal_red"
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.addSingleScan,
                                                                            modifier: {
                                                                                cluster_name: "portal_teleported",
                                                                                duration: 20
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.teleportToTarget,
                                                                            modifier: {
                                                                                target: "source"
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 4,
                                duration: 350,
                                height: 2,
                                r: 0.6,
                                g: 0.1,
                                b: 0.3,
                                a: 0.3
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 1,
                                duration: 350,
                                height: 4,
                                r: 1.0,
                                g: 0.7,
                                b: 0.9,
                                a: 0.8
                            }
                        }
                    ]
                }
            },
            spell_to: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 350,
                                delay: 2,
                                enable_cooldown: false,
                                spell: {
                                    id: magicFunction.sequenceCast,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.distanceTarget,
                                                modifier: {
                                                    distance: {
                                                        x: 4,
                                                        y: 4,
                                                        z: 4
                                                    },
                                                    offset: {
                                                        x: 0,
                                                        y: 2,
                                                        z: 0
                                                    },
                                                    include_actor: true,
                                                    impact: {
                                                        id: magicFunction.castMultipleSpell,
                                                        modifier: {
                                                            spell: [
                                                                {
                                                                    id: magicFunction.sourceTest,
                                                                    modifier: {
                                                                        single_scan: {
                                                                            exclude: {
                                                                                name: [ "portal_teleported" ]
                                                                            }
                                                                        },
                                                                        spell: {
                                                                            id: magicFunction.addSingleScan,
                                                                            modifier: {
                                                                                cluster_name: "portal_teleported",
                                                                                duration: 20
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    id: magicFunction.sourceTest,
                                                                    modifier: {
                                                                        single_scan: {
                                                                            include: {
                                                                                name: [ "portal_teleported" ]
                                                                            }
                                                                        },
                                                                        spell: {
                                                                            id: magicFunction.addSingleScanEntity,
                                                                            modifier: {
                                                                                cluster_name: "portal_red",
                                                                                duration: 3
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.castAtScanEntity,
                                                modifier: {
                                                    cluster_name: "portal_blue",
                                                    spell: {
                                                        id: magicFunction.sourceTest,
                                                        modifier: {
                                                            single_scan: {
                                                                include: {
                                                                    name: [ "portal_teleported" ]
                                                                }
                                                            },
                                                            spell: {
                                                                id: magicFunction.castMultipleSpell,
                                                                modifier: {
                                                                    spell: [
                                                                        {
                                                                            id: magicFunction.removeSingleScanEntity,
                                                                            modifier: {
                                                                                cluster_name: "portal_blue"
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.addSingleScan,
                                                                            modifier: {
                                                                                cluster_name: "portal_teleported",
                                                                                duration: 20
                                                                            }
                                                                        },
                                                                        {
                                                                            id: magicFunction.teleportToTarget,
                                                                            modifier: {
                                                                                target: "source"
                                                                            }
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 4,
                                duration: 350,
                                height: 2,
                                r: 0.1,
                                g: 0.3,
                                b: 0.6,
                                a: 0.3
                            }
                        },
                        {
                            id: magicFunction.createBoxParticleFromSource,
                            modifier: {
                                size: 1,
                                duration: 350,
                                height: 4,
                                r: 0.7,
                                g: 0.9,
                                b: 1.0,
                                a: 0.8
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "wind_whirl": {
        name: "Wind Whirl",
        path: "textures/ui/magic_list/wind_whirl",
        attribute: [ "manipulation", "wind" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 13,
        soul_cost: 20,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "wind_magic",
                        multiply: 40,
                        additive: 80
                    }
                ]
            },
            delay: 4,
            enable_cooldown: true,
            use_animation: false,
            can_cancel: true,
            force_slot: true,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.burstCast,
                            modifier: {
                                duration: 4,
                                spell: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.sourceTest,
                                                modifier: {
                                                    is_on_ground: true,
                                                    spell: {
                                                        id: magicFunction.setKnockbackToTarget,
                                                        modifier: {
                                                            target: "view",
                                                            strength: 0.7,
                                                            multiplier: { x: 1, y: 0, z: 1 }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.sourceTest,
                                                modifier: {
                                                    is_on_ground: false,
                                                    spell: {
                                                        id: magicFunction.setKnockbackToTarget,
                                                        modifier: {
                                                            target: "view",
                                                            strength: 0.8,
                                                            offset: { x: 0, y: -1, z: 0 }
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.playAnimation,
                                                modifier: {
                                                    animation: "animation.item_hand.center_pull",
                                                    controller: "pulling_controller"
                                                }
                                            },
                                            {
                                                id: magicFunction.playAnimation,
                                                modifier: {
                                                    animation: "animation.item_hand.rotation_left",
                                                    stop_state: "query.cooldown_time_remaining <= 0"
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            id: magicFunction.distanceTarget,
                            modifier: {
                                distance: 2,
                                exclude_families: "none",
                                impact: {
                                    id: magicFunction.castMultipleSpell,
                                    modifier: {
                                        spell: [
                                            {
                                                id: magicFunction.damageToSource,
                                                modifier: {
                                                    from: "actor",
                                                    strength: {
                                                        magic_attributes: [
                                                            {
                                                                magic_type: "wind_magic",
                                                                multiply: 2,
                                                                additive: 2
                                                            }
                                                        ]
                                                    }
                                                }
                                            },
                                            {
                                                id: magicFunction.setKnockbackToTarget,
                                                modifier: {
                                                    target: "source",
                                                    inverse: true,
                                                    multiplier: { x: 4, y: 0.5, z: 4 },
                                                    offset: { x: 0, y: -1, z: 0 }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        description: ""
    },
    "electrocute": {
        name: "Electrocute",
        path: "textures/ui/magic_list/electrocute",
        attribute: [ "manipulation", "thunder" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 13,
        soul_cost: 30,
        function: magicFunction.castSpellAtHit,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "thunder_magic",
                        multiply: 3,
                        additive: 2
                    }
                ]
            },
            enable_cooldown: true,
            can_cancel: true,
            ticking_duration: false,
            spell: {
                id: magicFunction.sequenceCast,
                modifier: {
                    delay: 5,
                    spell: [
                        {
                            id: magicFunction.thunderStreak,
                            modifier: {
                                strength: {
                                    magic_attributes: [
                                        {
                                            magic_type: "thunder_magic",
                                            multiply: 1,
                                            additive: 2
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            id: magicFunction.distanceTarget,
                            modifier: {
                                single_scan: true,
                                distance: 7,
                                exclude_families: [ "inanimate" ],
                                impact: {
                                    id: magicFunction.thunderStreak,
                                    modifier: {
                                        strength: {
                                            magic_attributes: [
                                                {
                                                    magic_type: "thunder_magic",
                                                    multiply: 0.5,
                                                    additive: 1
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            stop_spell: {
                id: magicFunction.castCooldown,
                modifier: {
                    cooldown_spell: "electrocute",
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "thunder_magic",
                                multiply: -15,
                                additive: 200
                            }
                        ]
                    }
                }
            }
        },
        description: ""
    },
    "gravity_pull_attack": {
        name: "Gravity Pull Attack",
        path: "textures/ui/magic_list/gravity_pull_attack",
        attribute: [ "manipulation", "void" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 18,
        soul_cost: 20,
        function: magicFunction.castSpellAtHit,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "void_magic",
                        multiply: 3,
                        additive: 2
                    }
                ]
            },
            enable_cooldown: true,
            can_cancel: true,
            ticking_duration: false,
            spell: {
                id: magicFunction.castMultipleSpell,
                modifier: {
                    spell: [
                        {
                            id: magicFunction.createParticle,
                            modifier: {
                                particle: "magic:animated_plane_circle",
                                offset: {
                                    x: 0,
                                    y: 0.5,
                                    z: 0
                                },
                                data: [
                                    {
                                        name: "size",
                                        data: 4
                                    },
                                    {
                                        name: "offset",
                                        data: {
                                            x: 0,
                                            y: 31,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "animation_and_duration",
                                        data: {
                                            x: 1,
                                            y: -1,
                                            z: 0.75
                                        }
                                    },
                                    {
                                        name: "frame",
                                        data: {
                                            x: 7,
                                            y: 31,
                                            z: 0
                                        }
                                    },
                                    {
                                        name: "color_from",
                                        data: {
                                            red: 0.46,
                                            green: 0.24,
                                            blue: 1.0,
                                            alpha: 1.0
                                        }
                                    },
                                    {
                                        name: "color_to",
                                        data: {
                                            red: 1.0,
                                            green: 1.0,
                                            blue: 1.0,
                                            alpha: 1.0
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            id:  magicFunction.burstCast,
                            modifier: {
                                duration: 20,
                                enable_cooldown: false,
                                can_cancel: false,
                                force_slot: false,
                                spell: {
                                    id:  magicFunction.distanceTarget,
                                    modifier: {
                                        distance: 4,
                                        impact: {
                                            id: magicFunction.setKnockbackToTarget,
                                            modifier: {
                                                target: "source",
                                                offset: { x: 0, y: -1, z: 0 },
                                                strength: 1.25
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            stop_spell: {
                id: magicFunction.castCooldown,
                modifier: {
                    cooldown_spell: "gravity_pull_attack",
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "void_magic",
                                multiply: -15,
                                additive: 300
                            }
                        ]
                    }
                }
            }
        },
        description: ""
    },
    "burning_slash": {
        name: "Burning Slash",
        path: "textures/ui/magic_list/burning_slash",
        attribute: [ "manipulation", "fire" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 10,
        soul_cost: 30,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.castCooldown,
                    modifier: {
                        cooldown_spell: "burning_slash",
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "fire_magic",
                                    multiply: -5,
                                    additive: 100
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: 4,
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.playAnimation,
                                        modifier: {
                                            animation: "animation.item_hand.rotation_left",
                                            blend: 0.6
                                        }
                                    },
                                    {
                                        id: magicFunction.playAnimation,
                                        modifier: {
                                            animation: "animation.item_hand.center_pull",
                                            controller: "pulling_controller"
                                        }
                                    }
                                ]
                            }
                        }
                    }
                },
                {
                    id: magicFunction.createSourceDummy,
                    modifier: {
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.createParticle,
                                        modifier: {
                                            particle: "magic:fire_slash",
                                            offset: {
                                                x: 0,
                                                y: 1.25,
                                                z: 0
                                            },
                                            data: [
                                                {
                                                    name: "rotation",
                                                    data: "rotation"
                                                },
                                                {
                                                    name: "distance",
                                                    data: 270
                                                },
                                                {
                                                    name: "speed",
                                                    data: 4
                                                },
                                                {
                                                    name: "amount",
                                                    data: 4
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        id: magicFunction.distanceTarget,
                                        modifier: {
                                            distance: 6,
                                            impact: {
                                                id: magicFunction.castMultipleSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.setKnockbackToTarget,
                                                            modifier: {
                                                                target: "source",
                                                                inverse: true,
                                                                offset: { x: 0, y: -1, z: 0 },
                                                                strength: 1.25
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.setFire,
                                                            modifier: {
                                                                strength: {
                                                                    magic_attributes: [
                                                                        {
                                                                            magic_type: "fire_magic",
                                                                            multiply: 1,
                                                                            additive: 2
                                                                        }
                                                                    ]
                                                                }
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "chain_damage": {
        name: "Chain Damage",
        path: "textures/ui/magic_list/chain_damage",
        attribute: [ "manipulation", "void" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 18,
        soul_cost: 33,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.setupSingleScan,
                    modifier: {
                        cluster_name: "chain_damage_control",
                        restart_cluster: true,
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "thunder_magic",
                                    multiply: 40,
                                    additive: 205
                                }
                            ]
                        }
                    }
                },
                {
                    id: magicFunction.castSpellAtHit,
                    modifier: {
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "thunder_magic",
                                    multiply: 40,
                                    additive: 200
                                }
                            ]
                        },
                        enable_cooldown: true,
                        can_cancel: true,
                        ticking_duration: true,
                        set_damage_path: "modifier>spell>0>modifier>spell>modifier>strength",
                        damage_percentage: {
                            magic_attributes: [
                                {
                                    magic_type: "thunder_magic",
                                    multiply: 0.09,
                                    additive: 0.1
                                }
                            ]
                        },
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.castAtScanEntity,
                                        modifier: {
                                            cluster_name: "chain_damage_control",
                                            spell: {
                                                id: magicFunction.castMultipleSpell,
                                                modifier: {
                                                    spell: [
                                                        {
                                                            id: magicFunction.damageToSource,
                                                            modifier: {
                                                                strength: 1
                                                            }
                                                        },
                                                        {
                                                            id: magicFunction.createLineSpellActorToSource,
                                                            modifier: {
                                                                r: 0.39,
                                                                g: 0.1,
                                                                b: 0.6,
                                                                duration: 5,
                                                                start: "self",
                                                                end: "source"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        }
                                    },
                                    {
                                        id: magicFunction.addSingleScanEntity,
                                        modifier: {
                                            cluster_name: "chain_damage_control"
                                        }
                                    }
                                ]
                            }
                        },
                        stop_spell: {
                            id: magicFunction.castCooldown,
                            modifier: {
                                cooldown_spell: "gravity_pull_attack",
                                duration: 100
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "provoke": {
        name: "Provoke",
        path: "textures/ui/magic_list/provoke",
        attribute: [ "manipulation", "light" ],
        grade: "intermediate",
        type: "combat",
        cast_duration: 13,
        soul_cost: 42,
        function: magicFunction.castMultipleSpell,
        modifier: {
            spell: [
                {
                    id: magicFunction.createParticle,
                    modifier: {
                        particle: "magic:animated_plane_circle",
                        offset: {
                            x: 0,
                            y: 0.5,
                            z: 0
                        },
                        data: [
                            {
                                name: "size",
                                data: 12
                            },
                            {
                                name: "offset",
                                data: {
                                    x: 0,
                                    y: 31,
                                    z: 0
                                }
                            },
                            {
                                name: "animation_and_duration",
                                data: {
                                    x: 1,
                                    y: -1,
                                    z: 0.35
                                }
                            },
                            {
                                name: "frame",
                                data: {
                                    x: 2,
                                    y: 31,
                                    z: 0
                                }
                            },
                            {
                                name: "color_from",
                                data: {
                                    red: 1.0,
                                    green: 0.91,
                                    blue: 0.38,
                                    alpha: 0.1
                                }
                            },
                            {
                                name: "color_to",
                                data: {
                                    red: 1.0,
                                    green: 1.0,
                                    blue: 1.0,
                                    alpha: 1.0
                                }
                            }
                        ]
                    }
                },
                {
                    id: magicFunction.setAttributeTarget,
                    modifier: {
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 20,
                                    additive: 60
                                }
                            ]
                        },
                        attributes: [
                            {
                                type: "minecraft:movement",
                                multiply: 0.4
                            }
                        ],
                        prevent_jump: true
                    }
                },
                {
                    id: magicFunction.burstCast,
                    modifier: {
                        duration: {
                            magic_attributes: [
                                {
                                    magic_type: "light_magic",
                                    multiply: 20,
                                    additive: 60
                                }
                            ]
                        },
                        enable_cooldown: true,
                        use_animation: false,
                        can_cancel: true,
                        spell: {
                            id: magicFunction.castMultipleSpell,
                            modifier: {
                                spell: [
                                    {
                                        id: magicFunction.createBoxParticleFromSource,
                                        modifier: {
                                            size: 0.75,
                                            duration: 5,
                                            height: 1.5,
                                            r: 1.0,
                                            g: 0.91,
                                            b: 0.38,
                                            a: 0.4
                                        }
                                    },
                                    {
                                        id: magicFunction.playAnimation,
                                        modifier: {
                                            animation: "animation.item_hand.rising",
                                            controller: "pulling_controller"
                                        }
                                    },
                                    {
                                        id: magicFunction.distanceTarget,
                                        modifier: {
                                            distance: 21,
                                            exclude_families: [ "inanimate", "animal" ],
                                            impact: {
                                                id: magicFunction.navigationToTarget,
                                                modifier: {
                                                    multiply: 0.6,
                                                    offset: {
                                                        x: 0, 
                                                        y: 1, 
                                                        z: 0
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        },
                        stop_spell: {
                            id: magicFunction.castCooldown,
                            modifier: {
                                cooldown_spell: "provoke",
                                duration: {
                                    magic_attributes: [
                                        {
                                            magic_type: "light_magic",
                                            multiply: -5,
                                            additive: 100
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        },
        description: ""
    },
    "ricochet_trident": {
        name: "Ricochet Trident",
        path: "textures/ui/magic_list/ricochet_trident",
        attribute: [ "transmutation", "nature" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 25,
        soul_cost: 17,
        function: magicFunction.castProjectile,
        modifier: {
            type: "amw:magic_thrown_trident",
            power: 2.9,
            despawn: 200,
            spell: {
                id: magicFunction.setBounceProjectile,
                modifier: {
                    max_step: 2,
                    bounce_strength: 1.0
                }
            }
        },
        description: ""
    },
    "everlasting_jump": {
        name: "Everlasting Jump",
        path: "textures/ui/magic_list/everlasting_jump",
        attribute: [ "manipulation", "wind" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 35,
        soul_cost: 19,
        function: magicFunction.burstCast,
        modifier: {
            duration: {
                magic_attributes: [
                    {
                        magic_type: "wind_magic",
                        multiply: 80,
                        additive: 100
                    }
                ]
            },
            can_cancel: true,
            enable_cooldown: true,
            use_animation: false,
            spell: {
                id: magicFunction.sourceTest,
                modifier: {
                    is_pressing_jumping: true,
                    spell: {
                        id: magicFunction.castMultipleSpell,
                        modifier: {
                            spell: [
                                {
                                    id: magicFunction.createParticle,
                                    modifier: {
                                        particle: "magic:wind_magic_effect",
                                        offset: {
                                            x: 0,
                                            y: 0.1,
                                            z: 0
                                        },
                                        data: []
                                    }
                                },
                                {
                                    id: magicFunction.setKnockbackToTarget,
                                    modifier: {
                                        target: "self",
                                        offset: {
                                            x: 0,
                                            y: 0.15,
                                            z: 0
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            },
            stop_spell: {
                id: magicFunction.castCooldown,
                modifier: {
                    cooldown_spell: "everlasting_jump",
                    duration: {
                        magic_attributes: [
                            {
                                magic_type: "wind_magic",
                                multiply: -18,
                                additive: 200
                            }
                        ]
                    }
                }
            }
        },
        description: ""
    },
    "arrow_rain": {
        name: "Arrow Rain",
        path: "textures/ui/magic_list/arrow_rain",
        attribute: [ "creation", "dark", "nature" ],
        grade: "intermediate",
        type: "action",
        cast_duration: 10,
        soul_cost: 12,
        function: magicFunction.castSpellAtView,
        modifier: {
            range: {
                magic_attributes: [
                    {
                        magic_type: "dark_magic",
                        multiply: 4,
                        additive: 16
                    },
                    {
                        magic_type: "nature_magic",
                        multiply: 2,
                        additive: 0
                    }
                ]
            },
            set_to_floor: true,
            impact: {
                id: magicFunction.castRandomLocationSpell,
                modifier: {
                    size: { x: 8, y: 1, z: 8 },
                    offset: { x: 0, y: 5, z: 0 },
                    strength: 1,
                    focus: "source",
                    spell: {
                        id: magicFunction.iterationCast,
                        modifier: {
                            iteration: {
                                magic_attributes: [
                                    {
                                        magic_type: "dark_magic",
                                        multiply: 3,
                                        additive: 5
                                    },
                                    {
                                        magic_type: "nature_magic",
                                        multiply: 2,
                                        additive: 0
                                    }
                                ]
                            },
                            delay: 2,
                            iteration_node: [
                                {
                                    path: "modifier>offset",
                                    node: {
                                        '0': { x: 0, y: 0, z: 0 },
                                        '5': { x: 0, y: 3, z: 0 },
                                        '10': { x: 0, y: 5, z: 0 },
                                        '15': { x: 0, y: 7, z: 0 },
                                        '20': { x: 0, y: 8, z: 0 },
                                        '25': { x: 0, y: 8.5, z: 0 },
                                        '30': { x: 0, y: 9, z: 0 }
                                    }
                                }
                            ],
                            spell:  {
                                id: magicFunction.castRandomLocationSpell,
                                modifier: {
                                    size: { x: 1, y: 1, z: 1 },
                                    offset: { x: 0, y: 0, z: 0 },
                                    strength: 1,
                                    focus: "view",
                                    spell: {
                                        id: magicFunction.castRandomRotatedSpell,
                                        modifier: {
                                            strength: 0.1,
                                            spell: {
                                                id: magicFunction.castProjectile,
                                                modifier: {
                                                    type: "amw:magic_arrow",
                                                    power: 2.9,
                                                    despawn: 200
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        description: ""
    }
};


/*
type: 
    creation,
    restoration,
    conjuration,
    destruction,
    transmutation,
    manipulation

elements:
    nature,
    fire, 
    void, 
    dark,
    water,
    thunder,
    wind,
    light,
    ice

grade:
0    basic,
1    intermediate,
2    advance,
3    expert,
4    master

ganti:
    alternate damage (cooldown)
*/
