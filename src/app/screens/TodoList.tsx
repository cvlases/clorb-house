import { useNavigate } from "react-router";
import { motion } from "motion/react";
import imgImg065921 from "../../imports/IPhone165/8ed2eefc22017c6fe97892a6d10d9c37e1f82d6d.png";
import imgUntitled500X500Px61 from "../../imports/IPhone165/749af56786e9c6161adfcf899904dec36b1941a5.png";
import svgPaths from "../../imports/IPhone165/svg-kfaj6v6rpn";
import { TASKS } from "../constants/tasks";
import { getGuiltLevel, getHoursSinceLastChore } from "../hooks/useGameState";

const guiltConfig = [
  {
    copy: "Look at us. A beacon of productivity. Let's keep it up.",
    clorbAnimation: { rotate: [0, 10, -10, 0] } as const,
    overlay: "rgba(0,0,0,0)",
    badge: { bg: "#beff6c", text: "All caught up!" },
  },
  {
    copy: "It's getting a little chaotic in here. Care to help a blob out?",
    clorbAnimation: { x: [-4, 4, -4] } as const,
    overlay: "rgba(255, 200, 0, 0.12)",
    badge: { bg: "#FFD700", text: "Things are piling up..." },
  },
  {
    copy: "I have named the dust bunnies. We need an intervention.",
    clorbAnimation: { y: [0, -6, 0] } as const,
    overlay: "rgba(0, 180, 0, 0.15)",
    badge: { bg: "#ff576a", text: "DISASTER MODE 🤢" },
  },
];

export default function TodoList() {
  const navigate = useNavigate();
  const guiltLevel = getGuiltLevel();
  const hoursSince = getHoursSinceLastChore();
  const guilt = guiltConfig[guiltLevel];

  const handleTaskClick = (taskId: string) => {
    navigate(`/task-select/${taskId}`);
  };

  const daysSinceText = () => {
    if (hoursSince === Infinity) return "You haven't done a chore yet.";
    if (hoursSince < 1) return "Last chore: less than an hour ago.";
    if (hoursSince < 24) return `Last chore: ${Math.floor(hoursSince)}h ago.`;
    const days = Math.floor(hoursSince / 24);
    return `Last chore: ${days} day${days !== 1 ? "s" : ""} ago.`;
  };

  return (
    <div className="bg-[#fff85a] relative size-full overflow-hidden">
      {/* Room background */}
      <div className="absolute h-[706px] left-[-1px] top-[-37px] w-[394px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgImg065921}
          style={{ filter: guiltLevel === 2 ? "hue-rotate(80deg) saturate(1.3)" : guiltLevel === 1 ? "saturate(0.8)" : "none" }}
        />
      </div>

      {/* Guilt color overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundColor: guilt.overlay }}
      />

      {/* Clorb */}
      <motion.div
        className="absolute left-[176px] size-[102px] top-[483px]"
        animate={guilt.clorbAnimation}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          alt="Clorb character"
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgUntitled500X500Px61}
        />
      </motion.div>

      {/* Guilt badge */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-[72px] px-[16px] py-[8px] rounded-[18px] border border-black"
        style={{ backgroundColor: guilt.badge.bg }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] text-black text-center whitespace-nowrap">
          {guilt.badge.text}
        </p>
      </motion.div>

      {/* Guilt copy */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-[108px] w-[300px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium text-[13px] text-black text-center leading-[1.4]">
          "{guilt.copy}"
        </p>
        <p className="font-['Work_Sans:Regular',sans-serif] text-[11px] text-black/60 text-center mt-[4px]">
          {daysSinceText()}
        </p>
      </motion.div>

      {/* To Do List Panel */}
      <div className="-translate-x-1/2 absolute left-1/2 bottom-0 bg-white border-black border-solid border-t-4 rounded-tl-[24px] rounded-tr-[24px] w-[393px] h-[200px]">
        <div className="-translate-x-1/2 absolute h-[16px] left-[calc(50%-3.04px)] top-[18px] w-[21.216px]">
          <div className="absolute bottom-1/4 left-[16.34%] right-[16.34%] top-[8.06%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.281 10.7099">
              <path d={svgPaths.p19d7bc80} fill="var(--fill-0, #020202)" />
            </svg>
          </div>
        </div>

        <p className="-translate-x-1/2 absolute font-['Work_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[calc(50%+0.68px)] text-[20px] text-black text-center top-[25.74px] whitespace-nowrap">
          Start a Task
        </p>

        {/* Task Icons — scrollable */}
        <div className="absolute left-0 right-0 top-[75px] px-[16px] overflow-x-auto">
          <div className="flex gap-[12px] w-max">
            {TASKS.map((task) => (
              <motion.button
                key={task.id}
                onClick={() => handleTaskClick(task.id)}
                className="flex flex-col items-center gap-[6px] cursor-pointer"
                whileTap={{ scale: 0.9 }}
              >
                <div
                  className="size-[48px] rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]"
                  style={{ backgroundColor: task.color }}
                >
                  <span className="text-[22px]">{task.emoji}</span>
                </div>
                <p className="font-['Work_Sans:Regular',sans-serif] text-[9px] text-black text-center w-[52px] leading-[12px]">
                  {task.name}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="-translate-x-1/2 absolute bg-black content-stretch flex gap-[8px] items-center left-[calc(50%+0.5px)] pl-px pr-[8px] py-px rounded-[20px] top-[19px] w-[192px]">
        <div className="bg-[#42aaff] content-stretch flex items-center justify-center p-[8px] relative rounded-[18px] shrink-0 w-[88px]">
          <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
            Clorb Room
          </p>
        </div>
        <button
          onClick={() => navigate("/shelf")}
          className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-center text-white w-[75px] cursor-pointer"
        >
          Clorb House
        </button>
      </div>
    </div>
  );
}
