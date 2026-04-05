import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import imgBackground from "../../imports/IPhone165/8ed2eefc22017c6fe97892a6d10d9c37e1f82d6d.png";
import imgClorb from "../../imports/IPhone165/749af56786e9c6161adfcf899904dec36b1941a5.png";
import svgPaths from "../../imports/IPhone165/svg-kfaj6v6rpn";
import { TASKS, TASK_CATEGORIES } from "../constants/tasks";
import { TASK_ICONS, TASK_TAGLINES } from "../constants/taskConfig";
import { getGuiltLevel, getHoursSinceLastChore } from "../hooks/useGameState";

type Category = (typeof TASK_CATEGORIES)[number];

const guiltConfig = [
  {
    copy: "You've been keeping up. The dust bunnies fear you.",
    clorbAnimation: { rotate: [0, 10, -10, 0] } as const,
    overlay: "rgba(0,0,0,0)",
  },
  {
    copy: "It's getting a little chaotic in here. Care to help a blob out?",
    clorbAnimation: { x: [-4, 4, -4] } as const,
    overlay: "rgba(255, 200, 0, 0.10)",
  },
  {
    copy: "I have named the dust bunnies. We need an intervention.",
    clorbAnimation: { y: [0, -6, 0] } as const,
    overlay: "rgba(0, 180, 0, 0.15)",
  },
];

export default function TodoList() {
  const navigate = useNavigate();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>("frequent");

  const guiltLevel = getGuiltLevel();
  const hoursSince = getHoursSinceLastChore();
  const guilt = guiltConfig[guiltLevel];

  const filteredTasks = TASKS.filter(
    (t) => activeCategory === "frequent" || t.category === activeCategory
  );

  const daysSinceText = () => {
    if (hoursSince === Infinity) return null;
    if (hoursSince < 1) return "last chore: less than an hour ago";
    if (hoursSince < 24) return `last chore: ${Math.floor(hoursSince)}h ago`;
    const days = Math.floor(hoursSince / 24);
    return `last chore: ${days} day${days !== 1 ? "s" : ""} ago`;
  };

  const handleJoin = (taskId: string) => {
    setSheetOpen(false);
    navigate(`/time-select/${taskId}`);
  };

  return (
    <div className="bg-[#fff85a] relative size-full overflow-hidden">
      {/* Room background */}
      <div className="absolute h-[706px] left-[-1px] top-[-37px] w-[394px]">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgBackground}
          style={{
            filter:
              guiltLevel === 2
                ? "hue-rotate(80deg) saturate(1.3)"
                : guiltLevel === 1
                ? "saturate(0.7)"
                : "none",
          }}
        />
      </div>

      {/* Guilt overlay */}
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
          alt="Clorb"
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgClorb}
        />
      </motion.div>

      {/* Guilt copy */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-[88px] w-[300px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="font-['Work_Sans:Medium',sans-serif] text-[13px] text-black text-center leading-[1.5]">
          "{guilt.copy}"
        </p>
        {daysSinceText() && (
          <p className="font-['Work_Sans:Regular',sans-serif] text-[11px] text-black/50 text-center mt-[4px]">
            {daysSinceText()}
          </p>
        )}
      </motion.div>

      {/* Bottom panel — tap to open the task sheet */}
      <div
        className="-translate-x-1/2 absolute left-1/2 bottom-0 bg-white border-black border-solid border-t-4 rounded-tl-[24px] rounded-tr-[24px] w-[393px] h-[100px] cursor-pointer"
        onClick={() => setSheetOpen(true)}
      >
        {/* Pull indicator */}
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[40px] h-[5px] rounded-full bg-black/20" />

        <p className="-translate-x-1/2 absolute font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[20px] text-black text-center top-[30px] left-1/2 whitespace-nowrap">
          Start a Task
        </p>

        <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2">
          <div className="absolute bottom-1/4 left-[16.34%] right-[16.34%] top-[8.06%]">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 14.281 10.7099"
              style={{ width: 14, height: 11 }}
            >
              <path
                d={svgPaths.p19d7bc80}
                fill="var(--fill-0, #020202)"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Top nav */}
      <div className="-translate-x-1/2 absolute bg-black flex gap-[4px] items-center left-[calc(50%+0.5px)] pl-px pr-[8px] py-px rounded-[20px] top-[19px] w-[220px]">
        <div className="bg-[#42aaff] flex items-center justify-center p-[8px] relative rounded-[18px] shrink-0 w-[100px]">
          <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] text-[12px] text-black text-center whitespace-nowrap">
            Clorbhouse
          </p>
        </div>
        <button
          onClick={() => navigate("/shelf")}
          className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] text-[11px] text-center text-white flex-1 cursor-pointer whitespace-nowrap"
        >
          Clorb's Collections
        </button>
      </div>

      {/* ── Task Menu Bottom Sheet ─────────────────────────────────── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-[#fefdf8] border-t-4 border-black rounded-tl-[24px] rounded-tr-[24px] z-30 overflow-hidden"
              style={{ maxHeight: "82%" }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-[12px] pb-[4px]">
                <div className="w-[40px] h-[5px] rounded-full bg-black/20" />
              </div>

              {/* Header */}
              <div className="px-[20px] pt-[4px] pb-[12px] border-b-2 border-black">
                <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[22px] text-black">
                  To Do List
                </p>
              </div>

              {/* Category tabs */}
              <div className="flex gap-[8px] px-[16px] py-[10px] border-b border-black/10 overflow-x-auto">
                {TASK_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="px-[14px] py-[6px] rounded-[16px] border-2 border-black font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] whitespace-nowrap cursor-pointer shrink-0 transition-colors"
                    style={{
                      backgroundColor: activeCategory === cat ? "#beff6c" : "white",
                    }}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Task list */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(82vh - 160px)" }}>
                {filteredTasks.length === 0 ? (
                  <div className="px-[20px] py-[32px] text-center">
                    <p className="font-['Work_Sans:Medium',sans-serif] text-[14px] text-black/50">
                      No tasks in this category yet.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {filteredTasks.map((task, idx) => (
                      <motion.div
                        key={task.id}
                        className="flex items-center gap-[12px] px-[16px] py-[14px] border-b border-black/8"
                        style={{ backgroundColor: idx % 2 === 0 ? "white" : "#fefdf8" }}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                      >
                        {/* Task icon */}
                        <div
                          className="size-[52px] rounded-full border-2 border-black flex items-center justify-center shrink-0 overflow-hidden shadow-[2px_2px_0_0_#000]"
                          style={{ backgroundColor: task.color }}
                        >
                          {TASK_ICONS[task.id] ? (
                            <img
                              src={TASK_ICONS[task.id]}
                              alt={task.name}
                              className="w-[36px] h-[36px] object-contain"
                            />
                          ) : (
                            <span className="text-[24px]">{task.emoji}</span>
                          )}
                        </div>

                        {/* Task info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-[6px] mb-[1px]">
                            <span className="font-['Work_Sans:Regular',sans-serif] text-[11px] text-black/50">
                              ↑ {task.clorbCount.toLocaleString()} Clorbs Now
                            </span>
                          </div>
                          <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[16px] text-black leading-[1.2] truncate">
                            {task.name}
                          </p>
                          <p className="font-['Work_Sans:Regular',sans-serif] text-[12px] text-black/60 leading-[1.3] truncate">
                            {TASK_TAGLINES[task.id] ?? ""}
                          </p>
                        </div>

                        {/* Join button */}
                        <motion.button
                          onClick={() => handleJoin(task.id)}
                          className="bg-[#fff85a] border-2 border-black rounded-[16px] px-[14px] py-[8px] font-['Work_Sans:Bold',sans-serif] font-bold text-[13px] text-black shrink-0 cursor-pointer shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] transition-all"
                          whileTap={{ scale: 0.93 }}
                        >
                          Join
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
