scoreboard players set @s isekai:new_player 1

scoreboard players random @s isekai:rolling  1 20
tag @s[scores={isekai:rolling=1}] add cant_use_fighting_spirit
scoreboard players set @s isekai:rolling 0

replaceitem entity @s slot.hotbar 8 isekai:slot_locked 1 0 {"keep_on_death": {}, "item_lock": {"mode": "lock_in_slot"}}
