import { world, GameMode, ItemDurabilityComponent, ItemEnchantableComponent, EntityEquippableComponent, EquipmentSlot } from '@minecraft/server';
const available_items = new Set(["dk:vendaga", "dk:sinners_rod", "dk:sentinel_halberd", "dk:sickle_of_fatality", "dk:sword_of_fatality", "dk:unbound_arm", "dk:unbound_arm_punch", "dk:volcano_sword"]);

world.afterEvents.itemUse.subscribe(({ source, itemStack }) => {
  const player = source;
  const durability = itemStack.getComponent(ItemDurabilityComponent.componentId);
  const unbreakingLvl = itemStack.getComponent(ItemEnchantableComponent.componentId)?.getEnchantment('unbreaking')?.level || 0;

  if (player.getGameMode() == GameMode.creative) return;
  if (!available_items.has(itemStack.typeId)) return;

  function handleDurability(durabilityIncrease) {
    if (!durability) return;
    if (1 / (unbreakingLvl + 1) < Math.random()) return;

    durability.damage = Math.min(durability.maxDurability, durability.damage + durabilityIncrease);
 
    if (durability.damage === durability.maxDurability) {
      player.getComponent(EntityEquippableComponent.componentId).setEquipment(EquipmentSlot.Mainhand);
      player.playSound("random.break");
    } else {
      player.getComponent(EntityEquippableComponent.componentId).setEquipment(EquipmentSlot.Mainhand, itemStack);
    }
  }

  switch (itemStack.typeId) {
    case "dk:vendaga":
      handleDurability(1);
      break;

    case "dk:sinners_rod":
      handleDurability(250);
      break;

    case "dk:sentinel_halberd":
      handleDurability(player.isSneaking ? 500 : 400);
      break;

    case "dk:volcano_sword":
      handleDurability(player.isSneaking ? 20 : 40);
      break;
  }
});