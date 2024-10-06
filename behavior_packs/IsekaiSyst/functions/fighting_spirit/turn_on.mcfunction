scoreboard players set @s[tag=!cant_use_fighting_spirit, scores={amw:soul=100..}] isekai:fighting_spirit 1

event entity @s[scores={isekai:fighting_spirit_exp=5000..9999, amw:soul=100..}] isekai:fighting_spirit_lv1

event entity @s[scores={isekai:fighting_spirit_exp=10000..14999, amw:soul=100..}] isekai:fighting_spirit_lv2

event entity @s[scores={isekai:fighting_spirit_exp=15000..24999, amw:soul=100..}] isekai:fighting_spirit_lv3

event entity @s[scores={isekai:fighting_spirit_exp=25000..49999, amw:soul=100..}] isekai:fighting_spirit_lv4

event entity @s[scores={isekai:fighting_spirit_exp=50000.., amw:soul=100..}] isekai:fighting_spirit_lv5

scoreboard players remove @s[scores={amw:soul=100..}] amw:soul 50