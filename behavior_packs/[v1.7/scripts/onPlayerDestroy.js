// Import necessary modules from Minecraft server API
import { world, ItemStack } from '@minecraft/server';

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:baobab_fence_on_player_destroy for fence destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:baobab_fence_on_player_destroy', {
        // Define behavior when a player destroys the fence
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();

            // Remove korbon:baobab_fence_inventory on top if present
            if (aboveBlock.typeId === 'korbon:baobab_fence_inventory') {
                aboveBlock.setType('minecraft:air')
            }
        }
    });
});

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:jacaranda_fence_on_player_destroy for fence destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:jacaranda_fence_on_player_destroy', {
        // Define behavior when a player destroys the fence
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();

            // Remove korbon:jacaranda_fence_inventory on top if present
            if (aboveBlock.typeId === 'korbon:jacaranda_fence_inventory') {
                aboveBlock.setType('minecraft:air')
            }
        }
    });
});

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:redwood_fence_on_player_destroy for fence destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:redwood_fence_on_player_destroy', {
        // Define behavior when a player destroys the fence
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();

            // Remove korbon:redwood_fence_inventory on top if present
            if (aboveBlock.typeId === 'korbon:redwood_fence_inventory') {
                aboveBlock.setType('minecraft:air')
            }
        }
    });
});






// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:baobab_fence_gate_on_player_destroy for fence destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:baobab_fence_gate_on_player_destroy', {
        // Define behavior when a player destroys the fence
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();

            // Remove the invisible korbon:fence_gate on top of our fence gate if present
            if (aboveBlock.typeId === 'korbon:baobab_fence_gate' && aboveBlock.permutation.getState('korbon:invisible')) {
                aboveBlock.setType('minecraft:air')
            }
        }
    });
});

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:jacaranda_fence_gate_on_player_destroy for fence destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:jacaranda_fence_gate_on_player_destroy', {
        // Define behavior when a player destroys the fence
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();

            // Remove the invisible korbon:fence_gate on top of our fence gate if present
            if (aboveBlock.typeId === 'korbon:jacaranda_fence_gate' && aboveBlock.permutation.getState('korbon:invisible')) {
                aboveBlock.setType('minecraft:air')
            }
        }
    });
});

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:redwood_fence_gate_on_player_destroy for fence destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:redwood_fence_gate_on_player_destroy', {
        // Define behavior when a player destroys the fence
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { block } = e;
            const aboveBlock = block.above();

            // Remove the invisible korbon:fence_gate on top of our fence gate if present
            if (aboveBlock.typeId === 'korbon:redwood_fence_gate' && aboveBlock.permutation.getState('korbon:invisible')) {
                aboveBlock.setType('minecraft:air')
            }
        }
    });
});





// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:baobab_slab_on_player_destroy for slab destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:baobab_slab_on_player_destroy', {
        // Define behavior when a player destroys the slab
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { player, dimension } = e;

            // Extract destroyed block permutation from event data
            const { destroyedBlockPermutation: perm } = e;

            // Check if player is valid
            if (!player) {
                return;
            }

            // Check if the slab is in the double state
            if (perm.getState('korbon:double')) {
                // Use destroyedBlockPermutation to get the ItemStack directly
                const slabItem = perm.getItemStack(1);
                if (slabItem) {
                    // Spawn the item at the destroyed block location
                    dimension.spawnItem(slabItem, e.block.location);
                }
            }
        }
    });
});

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:jacaranda_slab_on_player_destroy for slab destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:jacaranda_slab_on_player_destroy', {
        // Define behavior when a player destroys the slab
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { player, dimension } = e;

            // Extract destroyed block permutation from event data
            const { destroyedBlockPermutation: perm } = e;

            // Check if player is valid
            if (!player) {
                return;
            }

            // Check if the slab is in the double state
            if (perm.getState('korbon:double')) {
                // Use destroyedBlockPermutation to get the ItemStack directly
                const slabItem = perm.getItemStack(1);
                if (slabItem) {
                    // Spawn the item at the destroyed block location
                    dimension.spawnItem(slabItem, e.block.location);
                }
            }
        }
    });
});

// Subscribe to the 'worldInitialize' event to register custom components
world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:redwood_slab_on_player_destroy for slab destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:redwood_slab_on_player_destroy', {
        // Define behavior when a player destroys the slab
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { player, dimension } = e;

            // Extract destroyed block permutation from event data
            const { destroyedBlockPermutation: perm } = e;

            // Check if player is valid
            if (!player) {
                return;
            }

            // Check if the slab is in the double state
            if (perm.getState('korbon:double')) {
                // Use destroyedBlockPermutation to get the ItemStack directly
                const slabItem = perm.getItemStack(1);
                if (slabItem) {
                    // Spawn the item at the destroyed block location
                    dimension.spawnItem(slabItem, e.block.location);
                }
            }
        }
    });
});



world.beforeEvents.worldInitialize.subscribe(eventData => {
    // Register a custom component named korbon:spawnxp for block destruction
    eventData.blockComponentRegistry.registerCustomComponent('korbon:spawnxp', {
        // Define behavior when a player destroys the block
        onPlayerDestroy(e) {
            // Destructure event data for easier access
            const { player, dimension, block } = e;

            // Get the block's current location
            const { x, y, z } = block.location;

            // Check if the player is using a diamond or netherite pickaxe
            const equipment = player.getComponent('equippable');

            // Get the selected item from the player's mainhand
            const selectedItem = equipment.getEquipment('Mainhand');

            // Check if the selected item is 'minecraft:diamond_pickaxe' or 'minecraft:netherite_pickaxe'
            if (selectedItem && (selectedItem.typeId === 'minecraft:iron_pickaxe' || selectedItem.typeId === 'minecraft:diamond_pickaxe' || selectedItem.typeId === 'minecraft:netherite_pickaxe' || selectedItem.typeId === 'korbon:vibranium_pickaxe')) {
                
                // If valid, spawn the XP structure at the block's location
                block.dimension.runCommand(`/structure load mystructure:my_xp_structure ${x} ${y} ${z}`);
            }
        }
    });
});


