import { useNavigate, useParams, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { MessageCircle, Smile, X, Check, Plus } from "lucide-react";
import imgUntitled500X500Px62 from "../../imports/IPhone1612/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { CLORB_MESSAGES } from "../constants/tasks";

const randomClorbPositions = [
  { x: 28, y: 551 },
  { x: -42, y: 551 },
  { x: 52, y: 726 },
  { x: -65, y: 449 },
  { x: 62, y: 478 },
  { x: 52, y: 368 },
  { x: -130, y: 668 },
  { x: 28, y: 631 },
  { x: 147, y: 478 },
  { x: -58, y: 738 },
  { x: -101, y: 612 },
];

export default function ExecutionRoom() {
  const navigate = useNavigate();
  const { task } = useParams<{ task: string }>();
  const [searchParams] = useSearchParams();
  const duration = parseInt(searchParams.get("duration") || "30");
  
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [showMenu, setShowMenu] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

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

    // Show random messages
    const messageTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        setCurrentMessage(CLORB_MESSAGES[Math.floor(Math.random() * CLORB_MESSAGES.length)]);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 4000);
      }
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
    };
  }, [navigate, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleAddTime = (mins: number) => {
    setTimeLeft((prev) => prev + mins * 60);
    setShowMenu(false);
  };

  const handleFinish = () => {
    navigate("/reward");
  };

  const handleGiveUp = () => {
    navigate("/funeral");
  };

  return (
    <div className="bg-[#94adff] relative size-full overflow-hidden" data-name="iPhone 16 - 12" style={{ containerType: "size" }}>
      {/* Timer Display */}
      <div className="-translate-x-1/2 absolute left-1/2 top-[50px]">
        <div className="bg-[#c7d4ff] border-b-10 border-black border-l-2 border-r-2 border-solid border-t-2 font-['Work_Sans:Medium',sans-serif] font-medium h-[166px] rounded-[22.897px] text-black text-center w-[137.379px] transform rotate-90 flex flex-col items-center justify-center">
          <p className="text-[80px] leading-none">{String(minutes).padStart(2, '0')}</p>
          <p className="text-[16.028px] leading-[18.317px]">MINUTES</p>
        </div>
      </div>

      {/* Clorb Characters */}
      {randomClorbPositions.map((pos, idx) => (
        <motion.div
          key={idx}
          className="-translate-x-1/2 absolute size-[58px]"
          style={{ left: `calc(50%+${pos.x}px)`, top: `${pos.y}px` }}
          animate={{
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
            rotate: [0, Math.random() * 10 - 5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="transform -rotate-90">
            <img alt="Clorb" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px62} />
          </div>
        </motion.div>
      ))}

      {/* Idle Message */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="-translate-x-1/2 absolute bg-white border-2 border-black rounded-[16px] px-[16px] py-[12px] left-1/2 top-[200px] max-w-[280px] shadow-[4px_4px_0_0_#000]"
          >
            <p className="font-['Work_Sans:Medium',sans-serif] text-[14px] text-black text-center">{currentMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Menu */}
      <div className="-translate-x-1/2 absolute left-1/2 bottom-[60px]">
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-[80px] left-1/2 -translate-x-1/2 flex flex-col gap-[12px] items-center"
            >
              {/* Add Time Button */}
              <button
                onClick={() => handleAddTime(5)}
                className="bg-[#d99bfe] border-2 border-black rounded-full size-[48px] flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[3px_3px_0_0_#000] transition-all"
              >
                <Plus size={24} className="text-black" />
              </button>
              <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] text-black">Add Time</p>

              {/* Task Done Button */}
              <button
                onClick={handleFinish}
                className="bg-[#beff6c] border-2 border-black rounded-full size-[48px] flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[3px_3px_0_0_#000] transition-all"
              >
                <Check size={24} className="text-black" />
              </button>
              <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] text-black">Task Done</p>

              {/* Give Up Button */}
              <button
                onClick={handleGiveUp}
                className="bg-[#ff576a] border-2 border-black rounded-full size-[48px] flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[3px_3px_0_0_#000] transition-all"
              >
                <X size={24} className="text-black" />
              </button>
              <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] text-black">Give Up</p>

              {/* Chat Button */}
              <button className="bg-[#6bc6ff] border-2 border-black rounded-full size-[48px] flex items-center justify-center shadow-[2px_2px_0_0_#000] cursor-pointer hover:shadow-[3px_3px_0_0_#000] transition-all">
                <MessageCircle size={24} className="text-black" />
              </button>
              <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] text-black">Chat</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main FAB Button */}
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          className="bg-[#6bc6ff] border-4 border-black rounded-full size-[68px] flex items-center justify-center shadow-[4px_4px_0_0_#000] cursor-pointer hover:shadow-[6px_6px_0_0_#000] transition-all"
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: showMenu ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Plus size={32} className="text-black" />
          </motion.div>
        </motion.button>
      </div>

      {/* Stats Badge */}
      <div className="-translate-x-1/2 absolute bg-[#ffbcf9] border border-black px-[16px] py-[8px] rounded-[18px] left-1/2 top-[120px]">
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium text-[14px] text-black text-center whitespace-nowrap">
          <span className="font-['Work_Sans:Bold',sans-serif] font-bold">726</span> Clorbs getting sh*t done
        </p>
      </div>
    </div>
  );
}