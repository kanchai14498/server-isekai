scoreboard players set @s[tag=!cant_use_fighting_spirit, scores={amw:soul=50..}] isekai:fighting_spirit 1

event entity @s[scores={isekai:fighting_spirit_exp=5000..14999, amw:soul=50..}] isekai:fighting_spirit_lv1

event entity @s[scores={isekai:fighting_spirit_exp=15000..29999, amw:soul=50..}] isekai:fighting_spirit_lv2

event entity @s[scores={isekai:fighting_spirit_exp=30000..49999, amw:soul=50..}] isekai:fighting_spirit_lv3

event entity @s[scores={isekai:fighting_spirit_exp=50000..99999, amw:soul=50..}] isekai:fighting_spirit_lv4

event entity @s[scores={isekai:fighting_spirit_exp=100000.., amw:soul=50..}] isekai:fighting_spirit_lv5

scoreboard players remove @s[scores={amw:soul=50..}] amw:soul 50