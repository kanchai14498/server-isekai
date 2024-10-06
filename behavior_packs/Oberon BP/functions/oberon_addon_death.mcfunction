# === NO EDIT ===
gamerule commandblockoutput false
tickingarea add ~2 0 ~2 ~-2 0 ~-2 counter
scoreboard objectives add death_trigger dummy
scoreboard objectives add died dummy
scoreboard objectives add life.counter dummy "life Count"
scoreboard players set @a death_trigger 1
scoreboard players set @e[type=player] death_trigger 0
# === NO EDIT ===

# === COMMANDS HERE ===
execute at @a[scores={death_trigger=1,died=0},tag=instakill] run tag @s remove instakill
execute at @a[scores={death_trigger=1,died=0},tag=jump_slam_target] run tag @s remove jump_slam_target
# === COMMANDS HERE ===

# === NO EDIT ===
scoreboard players add @a[scores={death_trigger=1,died=0}] life.counter 1
scoreboard players set @a[scores={death_trigger=1,died=0}] died 1
scoreboard players set @e[type=player,scores={death_trigger=0}] died 0
# === NO EDIT ===

kill @e[type=slime]
