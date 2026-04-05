import { useNavigate, useParams, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Check, X, MessageCircle } from "lucide-react";
import imgClorb from "../../imports/IPhone1612/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { CLORB_MESSAGES, getTaskById } from "../constants/tasks";
import { TASK_ANIMATIONS, getSpeechLine, VIGIL_COPY } from "../constants/taskConfig";
import { useRoom } from "../../hooks/useRoom";
import { useChoreSession } from "../../hooks/useChoreSession";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomClorb {
  id: string;
  taskId: string;
  /** Percent of room width (0–100) */
  xPct: number;
  /** Percent of room height  (0–100) */
  yPct: number;
  animationDelay: number;
}

/**
 * Vigil sequence steps:
 * 0 = not started
 * 1 = user clorb falls sideways
 * 2 = surrounding clorbs move into circle
 * 3 = gravestone rises
 * 4 = stillness + overlay text
 */
type Phase = "active" | "give-up-confirm" | "vigil" | "complete";

// ─── Mock room data ────────────────────────────────────────────────────────────
// Replace `makeMockClorbs` with a backend fetch when ready.
const ALL_TASK_IDS = ["laundry", "emails", "bed", "dishes", "sweep", "trash", "dry", "wipe", "misc"];

const ROOM_POSITIONS = [
  { xPct: 10, yPct: 30 },
  { xPct: 22, yPct: 55 },
  { xPct: 35, yPct: 28 },
  { xPct: 50, yPct: 58 },
  { xPct: 63, yPct: 32 },
  { xPct: 75, yPct: 50 },
  { xPct: 87, yPct: 28 },
  { xPct: 16, yPct: 68 },
  { xPct: 42, yPct: 72 },
  { xPct: 68, yPct: 65 },
];

function makeMockClorbs(userTaskId: string): RoomClorb[] {
  return ROOM_POSITIONS.map((pos, i) => ({
    id: `clorb-${i}`,
    taskId: i === 0 ? userTaskId : ALL_TASK_IDS[i % ALL_TASK_IDS.length],
    xPct: pos.xPct,
    yPct: pos.yPct,
    animationDelay: i * 0.1,
  }));
}

// Vigil circle positions (centered around user clorb at ~50%, 50%)
function getVigilPositions(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
    return {
      xPct: 50 + Math.cos(angle) * 22,
      yPct: 50 + Math.sin(angle) * 28,
    };
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExecutionRoom() {
  const navigate   = useNavigate();
  const { task }   = useParams<{ task: string }>();
  const [searchParams] = useSearchParams();
  const duration   = parseInt(searchParams.get("duration") || "30");

  const currentTask = getTaskById(task);
  const { roomClorbs, leaveRoom, updateMessage } = useRoom(currentTask.id);
  const { startSession, completeSession, abandonSession } = useChoreSession();
  const vigilCircle   = useRef<ReturnType<typeof getVigilPositions>>([]);

  const [phase,       setPhase]      = useState<Phase>("active");
  const [vigilStep,   setVigilStep]  = useState(0);
  const [timeLeft,    setTimeLeft]   = useState(duration * 60);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [hoveredClorb, setHoveredClorb]   = useState<string | null>(null);
  const [hoveredMessage, setHoveredMessage] = useState("");
  const [addTimeFlash, setAddTimeFlash]   = useState<number | null>(null);
  const [userMessage,  setUserMessage]    = useState<string | null>(null);
  const [showMsgInput, setShowMsgInput]   = useState(false);
  const [draftMsg,     setDraftMsg]       = useState("");

  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // ── Start chore session on mount ─────────────────────────────────────────
  useEffect(() => {
    startSession(currentTask.id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Abandon session on hard exit (tab close / refresh) ───────────────────
  useEffect(() => {
    const onUnload = () => { abandonSession(); leaveRoom(); };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [abandonSession, leaveRoom]);

  // ── Orientation lock ──────────────────────────────────────────────────────
  useEffect(() => {
    if (screen?.orientation?.lock) {
      screen.orientation.lock("landscape").catch(() => {});
    }
    return () => { if (screen?.orientation?.unlock) screen.orientation.unlock(); };
  }, []);

  // ── Background → vigil ───────────────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden && phaseRef.current === "active") triggerVigil();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // ── Timer ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "active") return;
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          setPhase("complete");
          leaveRoom();
          completeSession();
          setTimeout(() => navigate("/reward"), 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase, navigate]);

  // ── Idle room messages ────────────────────────────────────────────────────
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

  // ── Vigil sequencer ────────────────────────────────────────────────────────
  const triggerVigil = useCallback(() => {
    vigilCircle.current = getVigilPositions(roomClorbs.length || 6);
    setPhase("vigil");
    setHoveredClorb(null);
    abandonSession();
    setVigilStep(1);                               // (1) user clorb drifts to center
    setTimeout(() => setVigilStep(2), 2000);       // (2) surrounding clorbs form circle
    setTimeout(() => setVigilStep(3), 3800);       // (3) gravestone rises + user clorb vanishes
    setTimeout(() => setVigilStep(4), 6000);       // (4) dark overlay + text
    setTimeout(async () => { await leaveRoom(); navigate("/todo"); }, 11000); // (5) navigate
  }, [navigate, roomClorbs.length, abandonSession, leaveRoom]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPct = Math.max(0, (1 - timeLeft / (duration * 60)) * 100);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="relative size-full overflow-hidden"
      style={{ backgroundColor: "#c8dcf8" }}
      onClick={() => hoveredClorb && setHoveredClorb(null)}
    >
      {/* ── Room background ────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #d4e8ff 0%, #b8d0f0 100%)" }} />
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[28%]" style={{ background: "linear-gradient(to top, #b0c8e8, #c4dcf8)" }} />
      <div className="absolute left-0 right-0 h-[2px]" style={{ bottom: "28%", backgroundColor: "rgba(100,140,200,0.4)" }} />

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-black/10">
        <div className="h-full bg-[#beff6c] transition-all duration-1000" style={{ width: `${progressPct}%` }} />
      </div>

      {/* ── Timer — large, right side ──────────────────────────────────── */}
      <div
        className="absolute flex flex-col gap-[6px]"
        style={{ right: 18, top: "50%", transform: "translateY(-50%)", zIndex: 10 }}
      >
        {[
          { value: String(minutes).padStart(2, "0"), label: "MIN" },
          { value: String(seconds).padStart(2, "0"), label: "SEC" },
        ].map(({ value, label }) => (
          <div
            key={label}
            style={{
              width: 110,
              height: 86,
              backgroundColor: "white",
              border: "3px solid black",
              borderRadius: 16,
              boxShadow: "4px 4px 0 0 black",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 54, lineHeight: 1, color: "black", fontVariantNumeric: "tabular-nums" }}>
              {value}
            </span>
            <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 9, color: "rgba(0,0,0,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 2 }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Clorb characters ──────────────────────────────────────────── */}
      {roomClorbs.map((clorb, idx) => {
        const isUser     = clorb.isUser ?? idx === 0;
        const isVigil    = phase === "vigil";
        const animSrc    = TASK_ANIMATIONS[clorb.taskId] ?? imgClorb;
        const vPos       = vigilCircle.current[idx];
        const isHovered  = hoveredClorb === clorb.id;

        // User clorb: move to center at step 1, disappear at step 3
        // Surrounding clorbs: move to circle only at step 2+
        const isMovingToCenter  = isUser  && isVigil && vigilStep >= 1;
        const isMovingToCircle  = !isUser && isVigil && vigilStep >= 2;
        const targetLeft  = isMovingToCenter ? "50%" : (isMovingToCircle ? `${vPos.xPct}%` : `${clorb.xPct}%`);
        const targetTop   = isMovingToCenter ? "46%" : (isMovingToCircle ? `${vPos.yPct}%` : `${clorb.yPct}%`);
        const targetOpacity = isUser && isVigil && vigilStep >= 3 ? 0 : 1;

        return (
          <motion.div
            key={clorb.id}
            className="absolute cursor-pointer"
            style={{ translateX: "-50%", translateY: "-50%", zIndex: isUser ? 5 : 3 }}
            animate={{
              left: targetLeft,
              top: targetTop,
              opacity: targetOpacity,
            }}
            transition={
              isVigil
                ? { duration: 0.9, type: "spring", damping: 18, delay: isUser ? 0 : 0.3 + idx * 0.06 }
                : { duration: 0 } // instant — no ambient movement
            }
            onMouseEnter={() => {
              if (!isUser && phase === "active") {
                setHoveredClorb(clorb.id);
                setHoveredMessage(clorb.userMessage ?? getSpeechLine(clorb.taskId));
              }
            }}
            onMouseLeave={() => setHoveredClorb(null)}
            onTouchStart={() => {
              if (!isUser && phase === "active") {
                const t = setTimeout(() => {
                  setHoveredClorb(clorb.id);
                  setHoveredMessage(clorb.userMessage ?? getSpeechLine(clorb.taskId));
                }, 300);
                return () => clearTimeout(t);
              }
            }}
          >
            {/* Speech bubble — message locked on hover-enter, never cycles */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  className="absolute pointer-events-none"
                  style={{ bottom: "calc(100% + 8px)", left: "50%", translateX: "-50%", zIndex: 20, minWidth: 140, maxWidth: 180 }}
                  initial={{ opacity: 0, y: 8, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.16 }}
                >
                  <div style={{ backgroundColor: "black", borderRadius: "12px 12px 12px 4px", padding: "8px 12px", position: "relative" }}>
                    <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 12, color: "white", textAlign: "center", lineHeight: 1.4 }}>
                      {hoveredMessage}
                    </p>
                    {/* Tail */}
                    <div style={{ position: "absolute", bottom: -7, left: 12, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "4px solid transparent", borderTop: "8px solid black" }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clorb image — GIF provides all animation */}
            <img
              alt="Clorb"
              src={animSrc}
              draggable={false}
              style={{ width: isUser ? 58 : 46, height: isUser ? 58 : 46, objectFit: "contain", display: "block", userSelect: "none" }}
            />
            {isUser && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: "50%", transform: "translateX(-50%)", backgroundColor: "#beff6c", border: "1px solid black", borderRadius: 5, padding: "1px 4px" }}>
                <span style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 8, color: "black", whiteSpace: "nowrap" }}>you</span>
              </div>
            )}
            {/* Persistent user message bubble */}
            {isUser && userMessage && (
              <motion.div
                className="absolute pointer-events-none"
                style={{ bottom: "calc(100% + 20px)", left: "50%", translateX: "-50%", zIndex: 20, minWidth: 120, maxWidth: 200 }}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", damping: 16, stiffness: 260 }}
              >
                <div style={{ backgroundColor: "#fff85a", border: "2.5px solid black", borderRadius: "12px 12px 4px 12px", padding: "7px 11px", position: "relative", boxShadow: "2px 2px 0 0 black" }}>
                  <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 11, color: "black", textAlign: "center", lineHeight: 1.4 }}>
                    {userMessage}
                  </p>
                  <div style={{ position: "absolute", bottom: -7, right: 10, width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid black" }} />
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* ── Gravestone (vigil step ≥ 3) ─────────────────────────────── */}
      <AnimatePresence>
        {phase === "vigil" && vigilStep >= 3 && (
          <motion.div
            className="absolute"
            style={{ left: "50%", bottom: "28%", translateX: "-50%", zIndex: 8 }}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 140 }}
          >
            <svg width="112" height="144" viewBox="0 0 56 72" fill="none">
              {/* Stone body — white fill, sketchy black outline */}
              <path d="M8,35 Q7.5,34 8,34 L48,34 Q48.5,34 48,35 L48.5,67.5 Q48,68.5 47,68 L9,68.5 Q8,68.5 7.5,67.5 Z" fill="white" />
              <path d="M8,34 L48,34 L48.5,68 Q28,69 7.5,68 Z" fill="none" stroke="black" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              {/* Arch top — white fill, sketchy outline */}
              <path d="M8,35 Q7.5,8 28,7.5 Q48.5,8 48,35Z" fill="white" />
              <path d="M8,35 Q7.5,8 28,7.5 Q48.5,8 48,35" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Side edges — slightly wobbly */}
              <path d="M8,34 Q7.2,50 7.5,68" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
              <path d="M48,34 Q48.8,50 48.5,68" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
              {/* Cross — hand-drawn strokes */}
              <path d="M27.5,16 Q28,15.5 28.5,16 L28.5,35.5 Q28,36 27.5,35.5 Z" fill="black" />
              <path d="M18,23 Q17.5,23.5 18,24 L38,24 Q38.5,23.5 38,23 Z" fill="black" />
              {/* Texture crack lines */}
              <path d="M18,42 Q21,44 19,47" fill="none" stroke="black" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
              <path d="M34,50 Q37,52 35,56" fill="none" stroke="black" strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />
              {/* Inscriptions */}
              <text x="28" y="51" textAnchor="middle" fill="black" fontSize="9" fontFamily="'Work Sans', sans-serif" fontWeight="700">{VIGIL_COPY.gravestoneTitle}</text>
              <text x="28" y="62" textAnchor="middle" fill="black" fontSize="6.5" fontFamily="'Work Sans', sans-serif">{VIGIL_COPY.gravestoneSubtitle}</text>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Idle message ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {showMessage && phase === "active" && (
          <motion.div
            className="absolute pointer-events-none"
            style={{ top: "22%", left: "50%", translateX: "-50%", zIndex: 10 }}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div style={{ backgroundColor: "white", border: "2px solid black", borderRadius: 14, padding: "10px 14px", maxWidth: 280, boxShadow: "4px 4px 0 0 black" }}>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, textAlign: "center", color: "black" }}>{currentMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom HUD ────────────────────────────────────────────────── */}
      {phase === "active" && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-[14px]" style={{ height: "20%", zIndex: 10 }}>
          {/* Social proof */}
          <div className="flex items-center gap-[6px]">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#beff6c", border: "1px solid black" }}
            />
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: "black" }}>
              <strong>{roomClorbs.length || currentTask.clorbCount}</strong> Clorbs {currentTask.actionName}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-[8px] items-center">
            {[
              { label: "+5m",  bg: "#d99bfe", action: () => { setTimeLeft(p => p + 300); setAddTimeFlash(5); setTimeout(() => setAddTimeFlash(null), 1200); } },
              { label: "+10m", bg: "#6bc6ff", action: () => { setTimeLeft(p => p + 600); setAddTimeFlash(10); setTimeout(() => setAddTimeFlash(null), 1200); } },
              { icon: <Check size={18} />, bg: "#beff6c", action: () => { setPhase("complete"); leaveRoom(); completeSession(); setTimeout(() => navigate("/reward"), 600); } },
              { icon: <X size={18} />,    bg: "#ff576a", action: () => setPhase("give-up-confirm") },
            ].map((btn, i) => (
              <motion.button
                key={i}
                onClick={btn.action}
                style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid black", backgroundColor: btn.bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0 0 black", cursor: "pointer", fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 11 }}
                whileTap={{ scale: 0.88 }}
              >
                {btn.label ?? btn.icon}
              </motion.button>
            ))}
            {/* Say something — one-shot, disappears after use */}
            {!userMessage && (
              <motion.button
                onClick={() => { setDraftMsg(""); setShowMsgInput(true); }}
                style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid black", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0 0 black", cursor: "pointer" }}
                whileTap={{ scale: 0.88 }}
                title="Say something"
              >
                <MessageCircle size={18} />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* +Xm flash */}
      <AnimatePresence>
        {addTimeFlash !== null && (
          <motion.div
            style={{ position: "absolute", bottom: "22%", right: 14, zIndex: 20, pointerEvents: "none" }}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -24 }}
            exit={{ opacity: 0 }}
          >
            <div style={{ backgroundColor: "#beff6c", border: "2px solid black", borderRadius: 10, padding: "4px 12px" }}>
              <span style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "black" }}>+{addTimeFlash}m</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Say something modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showMsgInput && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMsgInput(false)}
          >
            <motion.div
              style={{ backgroundColor: "#fefdf8", border: "4px solid black", borderRadius: 20, padding: 22, width: 320, boxShadow: "6px 6px 0 0 black" }}
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85 }}
              transition={{ type: "spring", damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 20, textAlign: "center", marginBottom: 4 }}>
                say something 💬
              </p>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, textAlign: "center", color: "rgba(0,0,0,0.5)", marginBottom: 14 }}>
                your clorb will hold this message for the rest of the task
              </p>
              <input
                autoFocus
                maxLength={40}
                value={draftMsg}
                onChange={(e) => setDraftMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draftMsg.trim()) {
                    const msg = draftMsg.trim();
                    setUserMessage(msg);
                    updateMessage(msg);
                    setShowMsgInput(false);
                  }
                }}
                placeholder="keep it short..."
                style={{ width: "100%", border: "2.5px solid black", borderRadius: 12, padding: "10px 14px", fontFamily: "'Work Sans', sans-serif", fontSize: 14, outline: "none", backgroundColor: "white", boxSizing: "border-box", marginBottom: 12 }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: "rgba(0,0,0,0.35)" }}>
                  {draftMsg.length}/40
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <motion.button
                    onClick={() => setShowMsgInput(false)}
                    style={{ border: "2px solid black", borderRadius: 12, padding: "8px 16px", cursor: "pointer", backgroundColor: "white", fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 13 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      if (draftMsg.trim()) {
                        const msg = draftMsg.trim();
                        setUserMessage(msg);
                        updateMessage(msg);
                        setShowMsgInput(false);
                      }
                    }}
                    disabled={!draftMsg.trim()}
                    style={{ border: "2px solid black", borderRadius: 12, padding: "8px 16px", cursor: draftMsg.trim() ? "pointer" : "not-allowed", backgroundColor: draftMsg.trim() ? "#fff85a" : "#e0e0e0", fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, boxShadow: draftMsg.trim() ? "2px 2px 0 0 black" : "none" }}
                    whileTap={{ scale: draftMsg.trim() ? 0.95 : 1 }}
                  >
                    Send
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Give Up confirmation ──────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "give-up-confirm" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.65)", zIndex: 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{ backgroundColor: "#fefdf8", border: "4px solid black", borderRadius: 24, padding: 28, width: 300, boxShadow: "8px 8px 0 0 black" }}
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", damping: 18 }}
            >
              <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 24, textAlign: "center", marginBottom: 6 }}>
                Are you sure?
              </p>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 15, textAlign: "center", marginBottom: 20 }}>
                Clorb only had <strong>{minutes > 0 ? `${minutes}m ` : ""}{String(seconds).padStart(2, "0")}s</strong> left...
              </p>
              <img alt="Sad Clorb" src={imgClorb} style={{ width: 72, height: 72, objectFit: "contain", opacity: 0.7, display: "block", margin: "0 auto 20px" }} />
              <div className="flex gap-[10px]">
                <motion.button onClick={() => setPhase("active")} style={{ flex: 1, backgroundColor: "#beff6c", border: "2px solid black", borderRadius: 14, padding: "12px 0", cursor: "pointer", fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14 }} whileTap={{ scale: 0.95 }}>Keep Going</motion.button>
                <motion.button onClick={triggerVigil}             style={{ flex: 1, backgroundColor: "#ff576a", border: "2px solid black", borderRadius: 14, padding: "12px 0", cursor: "pointer", fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14 }} whileTap={{ scale: 0.95 }}>Give Up</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Vigil overlay (step 4: stillness + text) ─────────────────── */}
      <AnimatePresence>
        {phase === "vigil" && vigilStep >= 4 && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ backgroundColor: "rgba(0,0,0,0.55)", zIndex: 50 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <motion.p
              style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 26, color: "white", textAlign: "center", marginBottom: 6 }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {VIGIL_COPY.overlayTitle}
            </motion.p>
            <motion.p
              style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", textAlign: "center" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {VIGIL_COPY.overlayBody}
            </motion.p>
            <motion.div className="flex gap-[16px] mt-[20px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
              {[0, 1, 2].map((i) => (
                <motion.span key={i} style={{ fontSize: 22 }} animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.3 + i * 0.2, repeat: Infinity }}>🕯️</motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
