import { useNavigate, useParams, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Plus, Check, X } from "lucide-react";
import imgClorb from "../../imports/IPhone1612/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { CLORB_MESSAGES, getTaskById } from "../constants/tasks";

const CLORB_POSITIONS = [
  { x: -130, y: 420 },
  { x: -60, y: 480 },
  { x: 20, y: 450 },
  { x: 100, y: 400 },
  { x: 150, y: 490 },
  { x: -100, y: 560 },
  { x: -20, y: 590 },
  { x: 70, y: 540 },
  { x: 130, y: 600 },
  { x: -70, y: 650 },
  { x: 40, y: 670 },
];

export default function ExecutionRoom() {
  const navigate = useNavigate();
  const { task } = useParams<{ task: string }>();
  const [searchParams] = useSearchParams();
  const duration = parseInt(searchParams.get("duration") || "30");

  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [showMenu, setShowMenu] = useState(false);
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [addTimeFlash, setAddTimeFlash] = useState<number | null>(null);

  const currentTask = getTaskById(task);
  const timeLeftRef = useRef(timeLeft);
  timeLeftRef.current = timeLeft;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/reward");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const messageTimer = setInterval(() => {
      if (Math.random() > 0.6) {
        setCurrentMessage(CLORB_MESSAGES[Math.floor(Math.random() * CLORB_MESSAGES.length)]);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
      }
    }, 12000);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [navigate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const totalSeconds = duration * 60;
  const progress = timeLeft / totalSeconds;

  const handleAddTime = (mins: number) => {
    setTimeLeft((prev) => prev + mins * 60);
    setAddTimeFlash(mins);
    setTimeout(() => setAddTimeFlash(null), 1200);
    setShowMenu(false);
  };

  const handleFinish = () => {
    navigate("/reward");
  };

  const handleGiveUpClick = () => {
    setShowMenu(false);
    setShowGiveUpModal(true);
  };

  const handleConfirmGiveUp = () => {
    navigate(`/funeral?timeLeft=${timeLeftRef.current}`);
  };

  return (
    <div className="bg-[#94adff] relative size-full overflow-hidden">
      {/* Floor line */}
      <div className="absolute bottom-[140px] left-0 right-0 h-[3px] bg-black/20" />

      {/* Room label */}
      <div className="absolute top-[16px] left-1/2 -translate-x-1/2">
        <div className="bg-black/20 px-[12px] py-[4px] rounded-[12px]">
          <p className="font-['Work_Sans:Medium',sans-serif] text-[12px] text-white">
            {currentTask.name} room
          </p>
        </div>
      </div>

      {/* Timer */}
      <div className="absolute top-[50px] left-1/2 -translate-x-1/2">
        <div className="bg-[#c7d4ff] border-4 border-black rounded-[20px] px-[24px] py-[12px] shadow-[4px_4px_0_0_#000] flex flex-col items-center min-w-[160px]">
          <p className="font-['Work_Sans:Medium',sans-serif] font-medium text-[64px] leading-none text-black tabular-nums">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </p>
          <p className="font-['Work_Sans:Regular',sans-serif] text-[12px] text-black/60 mt-[2px]">remaining</p>
          {/* Progress bar */}
          <div className="w-full h-[6px] bg-black/20 rounded-full mt-[8px]">
            <div
              className="h-full bg-[#beff6c] rounded-full transition-all duration-1000"
              style={{ width: `${(1 - progress) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Clorb count badge */}
      <div className="-translate-x-1/2 absolute bg-[#ffbcf9] border border-black px-[16px] py-[8px] rounded-[18px] left-1/2 top-[198px]">
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium text-[14px] text-black text-center whitespace-nowrap">
          <span className="font-['Work_Sans:Bold',sans-serif] font-bold">726</span> Clorbs getting sh*t done
        </p>
      </div>

      {/* Clorb Characters */}
      {CLORB_POSITIONS.map((pos, idx) => (
        <motion.div
          key={idx}
          className="absolute size-[52px]"
          style={{ left: `calc(50% + ${pos.x}px)`, top: `${pos.y}px` }}
          animate={{
            y: [0, -8, 0],
            rotate: [0, idx % 2 === 0 ? 5 : -5, 0],
          }}
          transition={{
            duration: 2.5 + (idx % 4) * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: idx * 0.15,
          }}
        >
          <img
            alt="Clorb"
            className="w-full h-full object-contain pointer-events-none"
            src={imgClorb}
          />
        </motion.div>
      ))}

      {/* Idle Message bubble */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute bg-white border-2 border-black rounded-[16px] px-[16px] py-[12px] left-1/2 -translate-x-1/2 top-[240px] max-w-[280px] shadow-[4px_4px_0_0_#000] z-10"
          >
            <p className="font-['Work_Sans:Medium',sans-serif] text-[13px] text-black text-center">{currentMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add time flash indicator */}
      <AnimatePresence>
        {addTimeFlash !== null && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-[200px] left-1/2 -translate-x-1/2 bg-[#beff6c] border-2 border-black rounded-[12px] px-[14px] py-[6px] pointer-events-none z-20"
          >
            <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[16px] text-black">+{addTimeFlash}m!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Menu */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[48px] flex flex-col items-center gap-[8px]">
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="flex flex-col items-center gap-[6px] mb-[8px]"
            >
              {/* Add Time row */}
              <div className="flex gap-[8px]">
                <button
                  onClick={() => handleAddTime(5)}
                  className="bg-[#d99bfe] border-2 border-black rounded-[16px] px-[16px] py-[8px] font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[13px] text-black shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[3px_3px_0_0_#000] transition-all"
                >
                  +5m
                </button>
                <button
                  onClick={() => handleAddTime(10)}
                  className="bg-[#d99bfe] border-2 border-black rounded-[16px] px-[16px] py-[8px] font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[13px] text-black shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[3px_3px_0_0_#000] transition-all"
                >
                  +10m
                </button>
              </div>

              {/* Finished button */}
              <button
                onClick={handleFinish}
                className="bg-[#beff6c] border-2 border-black rounded-[20px] px-[32px] py-[10px] w-[200px] shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[4px_4px_0_0_#000] transition-all"
              >
                <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[15px] text-black text-center">
                  Finished! ✓
                </p>
              </button>

              {/* Give Up button */}
              <button
                onClick={handleGiveUpClick}
                className="bg-[#ff576a] border-2 border-black rounded-[20px] px-[32px] py-[10px] w-[200px] shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[4px_4px_0_0_#000] transition-all"
              >
                <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[15px] text-black text-center">
                  Give Up
                </p>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-[#6bc6ff] border-4 border-black rounded-full size-[64px] flex items-center justify-center shadow-[4px_4px_0_0_#000] cursor-pointer"
          whileTap={{ scale: 0.9 }}
        >
          <motion.div animate={{ rotate: showMenu ? 45 : 0 }} transition={{ duration: 0.2 }}>
            <Plus size={30} className="text-black" />
          </motion.div>
        </motion.button>
      </div>

      {/* Give Up Confirmation Modal (inline — timer keeps running) */}
      <AnimatePresence>
        {showGiveUpModal && (
          <motion.div
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#fefdf8] border-4 border-black rounded-[24px] p-[28px] mx-[24px] w-full max-w-[340px] shadow-[8px_8px_0_0_#000]"
              initial={{ scale: 0.8, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 40 }}
              transition={{ type: "spring", damping: 18 }}
            >
              <p className="font-['Kodchasan:Bold',sans-serif] text-[26px] text-black text-center mb-[8px] tracking-[-0.52px]">
                Are you sure?
              </p>
              <p className="font-['Work_Sans:Medium',sans-serif] text-[16px] text-black text-center mb-[20px]">
                Clorb only had{" "}
                <span className="font-bold">
                  {minutes > 0 ? `${minutes}m ` : ""}{String(seconds).padStart(2, "0")}s
                </span>{" "}
                left...
              </p>

              <div className="flex items-center justify-center mb-[20px]">
                <img alt="Sad Clorb" src={imgClorb} className="w-[90px] h-[90px] object-contain opacity-70" />
              </div>

              <div className="flex gap-[10px]">
                <motion.button
                  onClick={() => setShowGiveUpModal(false)}
                  className="flex-1 bg-[#beff6c] border-2 border-black rounded-[16px] py-[12px] cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[15px] text-black text-center">
                    Keep Going
                  </p>
                </motion.button>
                <motion.button
                  onClick={handleConfirmGiveUp}
                  className="flex-1 bg-[#ff576a] border-2 border-black rounded-[16px] py-[12px] cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                >
                  <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[15px] text-black text-center">
                    Give Up
                  </p>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
