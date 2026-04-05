import { useNavigate, useParams, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Check, X } from "lucide-react";
import imgClorb from "../../imports/IPhone1612/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { CLORB_MESSAGES, getTaskById } from "../constants/tasks";
import { TASK_ANIMATIONS, CLORB_SPEECH_LINES } from "../constants/taskConfig";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape of each clorb present in the room.
 * Replace `mockRoomClorbs` with live data when backend is ready —
 * the rendering logic only reads this array. */
interface RoomClorb {
  id: string;
  taskId: string;
  /** Percent of room width (0–100) */
  xPct: number;
  /** Percent of room height (0–100) */
  yPct: number;
  speechLine: string;
  animationDelay: number;
}

type Phase = "active" | "give-up-confirm" | "vigil" | "complete";

// ─── Mock room population ─────────────────────────────────────────────────────

const ALL_TASK_IDS = ["laundry", "dishes", "tidying", "cooking", "working", "studying", "errands"];

function makeMockClorbs(userTaskId: string): RoomClorb[] {
  const positions = [
    { xPct: 12, yPct: 38 },
    { xPct: 24, yPct: 58 },
    { xPct: 36, yPct: 35 },
    { xPct: 48, yPct: 62 },
    { xPct: 60, yPct: 40 },
    { xPct: 72, yPct: 55 },
    { xPct: 85, yPct: 32 },
    { xPct: 18, yPct: 70 },
    { xPct: 42, yPct: 75 },
    { xPct: 65, yPct: 68 },
  ];

  return positions.map((pos, i) => ({
    id: `clorb-${i}`,
    taskId: i === 0 ? userTaskId : ALL_TASK_IDS[i % ALL_TASK_IDS.length],
    xPct: pos.xPct,
    yPct: pos.yPct,
    speechLine: CLORB_SPEECH_LINES[i % CLORB_SPEECH_LINES.length],
    animationDelay: i * 0.12,
  }));
}

// Positions for clorbs forming a vigil circle around center
function getVigilPositions(count: number): { xPct: number; yPct: number }[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return {
      xPct: 50 + Math.cos(angle) * 20,
      yPct: 50 + Math.sin(angle) * 25,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExecutionRoom() {
  const navigate = useNavigate();
  const { task } = useParams<{ task: string }>();
  const [searchParams] = useSearchParams();
  const duration = parseInt(searchParams.get("duration") || "30");

  const currentTask = getTaskById(task);
  const [roomClorbs] = useState<RoomClorb[]>(() => makeMockClorbs(currentTask.id));
  const vigilPositions = useRef(getVigilPositions(roomClorbs.length));

  const [phase, setPhase] = useState<Phase>("active");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [hoveredClorb, setHoveredClorb] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [addTimeFlash, setAddTimeFlash] = useState<number | null>(null);

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // ── Orientation lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (screen?.orientation?.lock) {
      screen.orientation.lock("landscape").catch(() => {
        // Not supported on desktop — no-op
      });
    }
    return () => {
      if (screen?.orientation?.unlock) {
        screen.orientation.unlock();
      }
    };
  }, []);

  // ── App backgrounding detection ───────────────────────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && phaseRef.current === "active") {
        triggerVigil();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase("complete");
          setTimeout(() => navigate("/reward"), 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, navigate]);

  // ── Idle messages ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;
    const t = setInterval(() => {
      if (Math.random() > 0.6) {
        setCurrentMessage(CLORB_MESSAGES[Math.floor(Math.random() * CLORB_MESSAGES.length)]);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
      }
    }, 14000);
    return () => clearInterval(t);
  }, [phase]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const triggerVigil = useCallback(() => {
    setPhase("vigil");
    setHoveredClorb(null);
    // Navigate to Clorbhouse after vigil plays out
    setTimeout(() => navigate("/todo"), 4200);
  }, [navigate]);

  const handleAddTime = (mins: number) => {
    setTimeLeft((prev) => prev + mins * 60);
    setAddTimeFlash(mins);
    setTimeout(() => setAddTimeFlash(null), 1200);
  };

  const handleFinish = () => {
    setPhase("complete");
    setTimeout(() => navigate("/reward"), 600);
  };

  const handleConfirmGiveUp = () => {
    triggerVigil();
  };

  // Long-press speech bubble for mobile
  const handleTouchStart = (clorbId: string) => {
    const t = setTimeout(() => setHoveredClorb(clorbId), 350);
    setLongPressTimer(t);
  };
  const handleTouchEnd = () => {
    if (longPressTimer) clearTimeout(longPressTimer);
    setTimeout(() => setHoveredClorb(null), 2000);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = duration * 60;
  const progressPct = Math.max(0, (1 - timeLeft / totalSeconds) * 100);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ backgroundColor: "#d4e8ff", zIndex: 100 }}
      onClick={() => hoveredClorb && setHoveredClorb(null)}
    >
      {/* ── Room background ────────────────────────────────────────────── */}
      {/* Floor */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[28%]"
        style={{ background: "linear-gradient(to top, #b8d4f8, #c9e0ff)" }}
      />
      {/* Wall top */}
      <div
        className="absolute top-0 left-0 right-0 h-[72%]"
        style={{ background: "linear-gradient(160deg, #d4e8ff 0%, #c4dcff 100%)" }}
      />
      {/* Floor line */}
      <div className="absolute bottom-[28%] left-0 right-0 h-[3px] bg-[#9ab8e0]/50" />

      {/* Simple room detail: washing machine (for laundry rooms) */}
      <div className="absolute top-[8%] left-[3%] opacity-30">
        <div className="w-[60px] h-[64px] bg-white/60 rounded-[8px] border-2 border-[#9ab8e0]">
          <div className="w-[40px] h-[40px] rounded-full border-2 border-[#9ab8e0] m-auto mt-[10px]" />
        </div>
      </div>

      {/* ── Top-right nav ──────────────────────────────────────────────── */}
      <div className="absolute top-[12px] right-[16px] flex gap-[6px] z-10">
        <div className="bg-[#beff6c] border-2 border-black rounded-[14px] px-[12px] py-[5px]">
          <p className="font-['Work_Sans:Medium',sans-serif] text-[11px] text-black font-medium">
            {currentTask.name}
          </p>
        </div>
        <button
          onClick={() => navigate("/todo")}
          className="bg-white border-2 border-black rounded-[14px] px-[12px] py-[5px] cursor-pointer"
        >
          <p className="font-['Work_Sans:Medium',sans-serif] text-[11px] text-black font-medium">
            Clorbhouse
          </p>
        </button>
      </div>

      {/* ── Clorbs in room ─────────────────────────────────────────────── */}
      {roomClorbs.map((clorb, idx) => {
        const isUserClorb = idx === 0;
        const animSrc = TASK_ANIMATIONS[clorb.taskId] ?? imgClorb;
        const vigilPos = vigilPositions.current[idx];
        const isVigil = phase === "vigil";
        const isHovered = hoveredClorb === clorb.id;

        return (
          <motion.div
            key={clorb.id}
            className="absolute cursor-pointer"
            style={{
              left: `${isVigil ? vigilPos.xPct : clorb.xPct}%`,
              top: `${isVigil ? vigilPos.yPct : clorb.yPct}%`,
              zIndex: isUserClorb ? 5 : 3,
            }}
            animate={
              isVigil
                ? {
                    left: `${vigilPos.xPct}%`,
                    top: `${vigilPos.yPct}%`,
                    rotate: isUserClorb ? 90 : 0,
                    scale: isUserClorb ? 1.1 : 0.9,
                  }
                : {
                    y: [0, -6, 0],
                    rotate: [0, idx % 2 === 0 ? 4 : -4, 0],
                  }
            }
            transition={
              isVigil
                ? { duration: 0.8, type: "spring", damping: 16, delay: isUserClorb ? 0 : 0.3 + idx * 0.08 }
                : {
                    duration: 2.2 + (idx % 4) * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: clorb.animationDelay,
                  }
            }
            onMouseEnter={() => !isUserClorb && setHoveredClorb(clorb.id)}
            onMouseLeave={() => setHoveredClorb(null)}
            onTouchStart={() => !isUserClorb && handleTouchStart(clorb.id)}
            onTouchEnd={handleTouchEnd}
          >
            {/* Speech bubble */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  initial={{ opacity: 0, y: 6, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  style={{ minWidth: 140, maxWidth: 180 }}
                >
                  <div
                    className="bg-black rounded-[12px] px-[12px] py-[8px] relative"
                    style={{ borderRadius: "12px 12px 12px 4px" }}
                  >
                    <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[12px] text-white text-center whitespace-normal leading-[1.4]">
                      {clorb.speechLine}
                    </p>
                    {/* Bubble tail */}
                    <div
                      className="absolute -bottom-[7px] left-[12px] w-0 h-0"
                      style={{
                        borderLeft: "8px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "8px solid black",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clorb image */}
            <img
              alt="Clorb"
              className="object-contain pointer-events-none select-none"
              style={{ width: isUserClorb ? 60 : 48, height: isUserClorb ? 60 : 48 }}
              src={animSrc}
            />
            {isUserClorb && (
              <div className="absolute -top-[14px] left-1/2 -translate-x-1/2 bg-[#beff6c] border border-black rounded-[6px] px-[4px] py-[1px]">
                <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[8px] text-black whitespace-nowrap">
                  you
                </p>
              </div>
            )}
          </motion.div>
        );
      })}

      {/* ── Timer (landscape — two side-by-side boxes) ─────────────────── */}
      <div className="absolute top-[12px] left-1/2 -translate-x-1/2 flex gap-[8px] z-10">
        <div className="bg-white border-4 border-black rounded-[16px] w-[100px] h-[72px] flex flex-col items-center justify-center shadow-[4px_4px_0_0_#000]">
          <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[40px] text-black leading-none tabular-nums">
            {String(minutes).padStart(2, "0")}
          </p>
          <p className="font-['Work_Sans:Regular',sans-serif] text-[9px] text-black/60 uppercase tracking-widest">
            Minutes
          </p>
        </div>
        <div className="bg-white border-4 border-black rounded-[16px] w-[100px] h-[72px] flex flex-col items-center justify-center shadow-[4px_4px_0_0_#000]">
          <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[40px] text-black leading-none tabular-nums">
            {String(seconds).padStart(2, "0")}
          </p>
          <p className="font-['Work_Sans:Regular',sans-serif] text-[9px] text-black/60 uppercase tracking-widest">
            Seconds
          </p>
        </div>
      </div>

      {/* Progress bar (subtle) */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-black/10">
        <div
          className="h-full bg-[#beff6c] transition-all duration-1000"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── Bottom HUD ────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[17%] flex items-center justify-between px-[16px] z-10">
        {/* Social proof */}
        <div className="flex items-center gap-[6px]">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-[8px] h-[8px] rounded-full bg-[#beff6c] border border-black"
          />
          <p className="font-['Work_Sans:Medium',sans-serif] text-[12px] text-black">
            <span className="font-bold">{currentTask.clorbCount}</span> Clorbs {currentTask.actionName}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[8px] items-center">
          {/* +5m */}
          <motion.button
            onClick={() => handleAddTime(5)}
            className="w-[44px] h-[44px] rounded-full border-2 border-black flex items-center justify-center font-['Work_Sans:Bold',sans-serif] font-bold text-[11px] text-black shadow-[2px_2px_0_0_#000] cursor-pointer"
            style={{ backgroundColor: "#d99bfe" }}
            whileTap={{ scale: 0.88 }}
          >
            +5m
          </motion.button>
          {/* +10m */}
          <motion.button
            onClick={() => handleAddTime(10)}
            className="w-[44px] h-[44px] rounded-full border-2 border-black flex items-center justify-center font-['Work_Sans:Bold',sans-serif] font-bold text-[11px] text-black shadow-[2px_2px_0_0_#000] cursor-pointer"
            style={{ backgroundColor: "#6bc6ff" }}
            whileTap={{ scale: 0.88 }}
          >
            +10m
          </motion.button>
          {/* Finish */}
          <motion.button
            onClick={handleFinish}
            className="w-[44px] h-[44px] rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer"
            style={{ backgroundColor: "#beff6c" }}
            whileTap={{ scale: 0.88 }}
          >
            <Check size={20} className="text-black" />
          </motion.button>
          {/* Give Up */}
          <motion.button
            onClick={() => setPhase("give-up-confirm")}
            className="w-[44px] h-[44px] rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer"
            style={{ backgroundColor: "#ff576a" }}
            whileTap={{ scale: 0.88 }}
          >
            <X size={20} className="text-black" />
          </motion.button>
        </div>
      </div>

      {/* +Xm flash */}
      <AnimatePresence>
        {addTimeFlash !== null && (
          <motion.div
            className="absolute bottom-[22%] right-[16px] bg-[#beff6c] border-2 border-black rounded-[10px] px-[12px] py-[4px] z-20 pointer-events-none"
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0 }}
          >
            <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[14px] text-black">
              +{addTimeFlash}m
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idle message bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="absolute top-[22%] left-1/2 -translate-x-1/2 bg-white border-2 border-black rounded-[14px] px-[14px] py-[10px] max-w-[280px] shadow-[4px_4px_0_0_#000] z-10 pointer-events-none"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <p className="font-['Work_Sans:Medium',sans-serif] text-[13px] text-black text-center">
              {currentMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Give Up Confirmation (inline modal) ────────────────────────── */}
      <AnimatePresence>
        {phase === "give-up-confirm" && (
          <motion.div
            className="absolute inset-0 bg-black/65 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#fefdf8] border-4 border-black rounded-[24px] p-[28px] mx-[24px] max-w-[340px] w-full shadow-[8px_8px_0_0_#000]"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", damping: 18 }}
            >
              <p className="font-['Kodchasan:Bold',sans-serif] text-[24px] text-black text-center mb-[6px] tracking-[-0.48px]">
                Are you sure?
              </p>
              <p className="font-['Work_Sans:Medium',sans-serif] text-[15px] text-black text-center mb-[20px]">
                Clorb only had{" "}
                <span className="font-bold">
                  {minutes > 0 ? `${minutes}m ` : ""}
                  {String(seconds).padStart(2, "0")}s
                </span>{" "}
                left...
              </p>
              <img
                alt="Sad Clorb"
                src={imgClorb}
                className="w-[80px] h-[80px] object-contain opacity-70 mx-auto mb-[20px]"
              />
              <div className="flex gap-[10px]">
                <motion.button
                  onClick={() => setPhase("active")}
                  className="flex-1 bg-[#beff6c] border-2 border-black rounded-[14px] py-[12px] cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-black text-center">
                    Keep Going
                  </p>
                </motion.button>
                <motion.button
                  onClick={handleConfirmGiveUp}
                  className="flex-1 bg-[#ff576a] border-2 border-black rounded-[14px] py-[12px] cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[14px] text-black text-center">
                    Give Up
                  </p>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vigil overlay ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "vigil" && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="font-['Kodchasan:Bold',sans-serif] text-[28px] text-white text-center tracking-[-0.56px] mb-[8px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              Clorb Vigil
            </motion.p>
            <motion.p
              className="font-['Work_Sans:Medium',sans-serif] text-[14px] text-white/70 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              The task has been abandoned. 🕯️
            </motion.p>
            <motion.div
              className="flex gap-[16px] mt-[20px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="text-[24px]"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.2 + i * 0.2, repeat: Infinity }}
                >
                  🕯️
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
