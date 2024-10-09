import { world, system } from "@minecraft/server";

let tickCount = 0;
const ticksPerTenMinutes = 12000; // 10 นาทีใน ticks (1 นาที = 1200 ticks)
const ticksPerNineMinutes = 10800; // 9 นาทีใน ticks (9*60*20)
const ticksPerLastFiveSeconds = 11900; // 5 วินาทีสุดท้ายใน ticks

function mainTick() {
    tickCount++;
    
    // เมื่อ tickCount ถึง 9 นาที
    if (tickCount === ticksPerNineMinutes) {
        world.sendMessage("อีก 1 นาที จะทำการเคลียของในเซิฟเวอร์");
    }
    
    // เมื่อ tickCount ถึง 5 วินาทีสุดท้าย
    if (tickCount >= ticksPerLastFiveSeconds && tickCount < ticksPerTenMinutes) {
        let secondsLeft = Math.floor((ticksPerTenMinutes - tickCount) / 20);
        world.sendMessage(`จะเคลียของใน ${secondsLeft} วินาที`);
    }
    
    // เมื่อ tickCount ถึง 10 นาที
    if (tickCount >= ticksPerTenMinutes) {
        world.sendMessage("ทำการเคลียของเรียบร้อย!");

        // เคลียร์ไอเท็มในทุกมิติ
        world.getDimension("overworld").runCommand("kill @e[type=item]");
        world.getDimension("nether").runCommand("kill @e[type=item]");
        world.getDimension("the_end").runCommand("kill @e[type=item]");

        tickCount = 0; // รีเซ็ตตัวนับ
    }

    // เรียก mainTick ใหม่เสมอ ไม่ว่าจะทำงานถึง 10 นาทีหรือไม่
    system.run(mainTick);
}

// เริ่มต้น loop โดยการเรียก mainTick ครั้งแรก
system.run(mainTick);
