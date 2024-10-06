scoreboard objectives add isekai:rolling dummy
scoreboard objectives add isekai:fighting_spirit_exp dummy
scoreboard objectives add isekai:new_player dummy
scoreboard objectives add isekai:fighting_spirit dummy

gamerule showtags false

scoreboard players set @s isekai:new_player 1

scoreboard players random @s isekai:rolling  1 20
tag @s[scores={isekai:rolling=20}] add cant_use_fighting_spirit
scoreboard players set @s isekai:rolling 0

replaceitem entity @s slot.hotbar 8 isekai:slot_locked 1 0 {"keep_on_death": {}, "item_lock": {"mode": "lock_in_slot"}}