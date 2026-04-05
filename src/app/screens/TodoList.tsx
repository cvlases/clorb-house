import { useNavigate } from "react-router";
import { motion, useMotionValue, animate } from "motion/react";
import { useState } from "react";
import imgBackground from "../../imports/IPhone165/8ed2eefc22017c6fe97892a6d10d9c37e1f82d6d.png";
import imgClorb from "../../imports/IPhone165/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { TASKS, TASK_CATEGORIES } from "../constants/tasks";
import { TASK_ICONS, TASK_TAGLINES } from "../constants/taskConfig";
import { getGuiltLevel } from "../hooks/useGameState";
import { TopNav } from "../components/TopNav";
import { useLiveCounts } from "../../hooks/useLiveCounts";

type Category = (typeof TASK_CATEGORIES)[number];
type PanInfo = { velocity: { y: number }; offset: { y: number } };

// ── Sheet geometry (portrait: 390 × 844) ─────────────────────────────────────
const SHEET_HEIGHT    = 660;
const COLLAPSED_VIS   = 148;
const COLLAPSE_Y      = SHEET_HEIGHT - COLLAPSED_VIS; // 512 — resting position
const EXPAND_Y        = 0;

const CLORB_ANIMS = [
  { rotate: [0, 10, -10, 0] as number[] },
  { x: [-4, 4, -4] as number[] },
  { y: [0, -6, 0] as number[] },
];
const ROOM_FILTERS = ["none", "saturate(0.7)", "hue-rotate(80deg) saturate(1.3)"];

export default function TodoList() {
  const navigate = useNavigate();
  const guiltLevel  = getGuiltLevel();
  const sheetY      = useMotionValue(COLLAPSE_Y);
  const [activeCategory, setActiveCategory] = useState<Category>("frequent");
  const liveCounts  = useLiveCounts(TASKS.map((t) => t.id));

  const snap = (to: number) =>
    animate(sheetY, to, { type: "spring", damping: 32, stiffness: 280 });

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const shouldCollapse = info.velocity.y > 300 || (info.velocity.y >= 0 && info.offset.y > 60);
    snap(shouldCollapse ? COLLAPSE_Y : EXPAND_Y);
  };

  const filteredTasks = TASKS.filter(
    (t) => activeCategory === "frequent" || t.category === activeCategory
  );

  return (
    <div className="relative size-full overflow-hidden bg-[#fff85a]">
      {/* Room background */}
      <img
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={imgBackground}
        style={{ filter: ROOM_FILTERS[guiltLevel] }}
      />

      {/* Clorb */}
      <motion.div
        className="absolute size-[102px]"
        style={{ left: 176, top: 420 }}
        animate={CLORB_ANIMS[guiltLevel]}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img alt="Clorb" src={imgClorb} className="w-full h-full object-contain pointer-events-none" />
      </motion.div>

      <TopNav active="clorbhouse" />

      {/* Backdrop: tap to collapse */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.35)", pointerEvents: "none" }}
        animate={{ opacity: sheetY.get() < COLLAPSE_Y - 30 ? 1 : 0 }}
      />
      <div
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
        onPointerDown={() => {
          if (sheetY.get() < COLLAPSE_Y - 30) snap(COLLAPSE_Y);
        }}
      />

      {/* ── Bottom sheet ─────────────────────────────────────────────────── */}
      <motion.div
        className="absolute left-0 right-0 bg-[#fefdf8] border-t-[3px] border-black"
        style={{
          bottom: 0,
          height: SHEET_HEIGHT,
          y: sheetY,
          borderRadius: "24px 24px 0 0",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
          zIndex: 10,
        }}
        drag="y"
        dragConstraints={{ top: EXPAND_Y, bottom: COLLAPSE_Y }}
        dragElastic={0.07}
        onDragEnd={handleDragEnd}
      >
        {/* Drag handle — tap to toggle */}
        <div
          className="flex justify-center items-center pt-[10px] pb-[4px] cursor-pointer"
          onClick={() => snap(sheetY.get() > COLLAPSE_Y / 2 ? EXPAND_Y : COLLAPSE_Y)}
        >
          <div className="w-[36px] h-[5px] rounded-full bg-black/25" />
        </div>

        {/* Title */}
        <div className="px-[20px] pt-[2px] pb-[8px]">
          <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 22, color: "black" }}>
            To Do List
          </p>
        </div>

        {/* ── Shortcut icons (visible in collapsed state) ─────────────── */}
        <div className="flex justify-around px-[10px] pb-[12px]">
          {TASKS.slice(0, 5).map((task) => (
            <motion.button
              key={task.id}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => navigate(`/time-select/${task.id}`)}
              className="flex flex-col items-center gap-[5px] cursor-pointer"
              whileTap={{ scale: 0.88 }}
            >
              <div
                className="size-[52px] rounded-full border-[2.5px] border-black flex items-center justify-center overflow-hidden shadow-[2px_2px_0_0_#000]"
                style={{ backgroundColor: task.color }}
              >
                {TASK_ICONS[task.id] ? (
                  <img src={TASK_ICONS[task.id]} alt={task.name} className="w-[34px] h-[34px] object-contain" />
                ) : (
                  <span className="text-[22px]">{task.emoji}</span>
                )}
              </div>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 9, width: 54, textAlign: "center", lineHeight: "12px", color: "black" }}>
                {task.name}
              </p>
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-[2px] bg-black/10" />

        {/* Category tabs */}
        <div className="flex gap-[8px] px-[16px] py-[10px] overflow-x-auto">
          {TASK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 px-[14px] py-[6px] rounded-[16px] border-[2px] border-black text-[12px] whitespace-nowrap cursor-pointer"
              style={{
                fontFamily: "'Work Sans', sans-serif",
                fontWeight: 600,
                backgroundColor: activeCategory === cat ? "#beff6c" : "white",
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Full task rows ─────────────────────────────────────────── */}
        <div className="overflow-y-auto" style={{ height: SHEET_HEIGHT - 224 }}>
          {filteredTasks.map((task, idx) => (
            <div
              key={task.id}
              className="flex items-center gap-[12px] px-[16px] py-[12px] border-b border-black/8"
              style={{ backgroundColor: idx % 2 === 0 ? "white" : "#fefdf8" }}
            >
              {/* Icon */}
              <div
                className="size-[50px] rounded-full border-[2px] border-black flex items-center justify-center shrink-0 overflow-hidden shadow-[2px_2px_0_0_#000]"
                style={{ backgroundColor: task.color }}
              >
                {TASK_ICONS[task.id] ? (
                  <img src={TASK_ICONS[task.id]} alt={task.name} className="w-[34px] h-[34px] object-contain" />
                ) : (
                  <span className="text-[22px]">{task.emoji}</span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="mb-[4px]">
                  <span style={{ backgroundColor: "#beff6c", border: "1.5px solid black", borderRadius: 8, padding: "2px 8px", fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "black", display: "inline-block", whiteSpace: "nowrap" }}>
                    {(liveCounts[task.id] ?? task.clorbCount).toLocaleString()} Clorbs
                  </span>
                </div>
                <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 14, lineHeight: 1.2, color: "black", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {task.name}
                </p>
                <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {TASK_TAGLINES[task.id] ?? ""}
                </p>
              </div>

              {/* Join */}
              <motion.button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => navigate(`/time-select/${task.id}`)}
                className="shrink-0 border-[2px] border-black rounded-[14px] px-[14px] py-[8px] shadow-[2px_2px_0_0_#000] cursor-pointer"
                style={{ backgroundColor: "#fff85a", fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "black" }}
                whileTap={{ scale: 0.92 }}
              >
                Join
              </motion.button>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <p className="text-center py-[24px]" style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.4)" }}>
              No tasks in this category yet.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
