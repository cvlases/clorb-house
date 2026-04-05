import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { ChevronUp, ChevronDown, ArrowLeft } from "lucide-react";
import svgPaths from "../../imports/IPhone168/svg-hh2rnczwo7";
import imgUntitled500X500Px61 from "../../imports/IPhone168/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { getTaskById } from "../constants/tasks";

const QUICK_SELECT = [
  { label: "15m", minutes: 15 },
  { label: "30m", minutes: 30 },
  { label: "1h", minutes: 60 },
];

export default function TimeSelect() {
  const navigate = useNavigate();
  const { task } = useParams<{ task: string }>();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const currentTask = getTaskById(task);

  const incrementHours = () => setHours((h) => Math.min(23, h + 1));
  const decrementHours = () => setHours((h) => Math.max(0, h - 1));
  const incrementMinutes = () => setMinutes((m) => (m + 5) % 60);
  const decrementMinutes = () => setMinutes((m) => (m === 0 ? 55 : m - 5));

  const handleQuickSelect = (mins: number) => {
    setHours(Math.floor(mins / 60));
    setMinutes(mins % 60);
  };

  const handleStart = () => {
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes > 0) {
      navigate(`/room/${task}?duration=${totalMinutes}`);
    }
  };

  const totalMinutes = hours * 60 + minutes;

  return (
    <div className="bg-[#ffa2e3] relative size-full overflow-hidden">
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        style={{ position: "absolute", top: 16, left: 16, zIndex: 20, width: 38, height: 38, borderRadius: "50%", backgroundColor: "black", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        whileTap={{ scale: 0.88 }}
      >
        <ArrowLeft size={18} color="white" />
      </motion.button>

      <p className="-translate-x-1/2 absolute font-['Kodchasan:Bold',sans-serif] leading-[1.2] left-[calc(50%+0.5px)] not-italic text-[#020202] text-[36px] text-center top-[58px] tracking-[-0.72px] w-[350px]">
        How long will you be {currentTask.actionName}?
      </p>

      <p className="-translate-x-1/2 absolute font-['Work_Sans:Medium',sans-serif] font-medium leading-[1.1] left-[calc(50%+0.5px)] text-[20px] text-black text-center top-[19.43%] w-[294px]">
        We estimate {currentTask.estimatedTime}.
      </p>

      <motion.div
        className="-translate-x-1/2 absolute left-[calc(50%+6.5px)] size-[260px] top-[260px]"
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          alt="Clorb character"
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgUntitled500X500Px61}
        />
      </motion.div>

      {/* Time Selection Panel */}
      <div className="-translate-x-1/2 absolute bottom-0 bg-[#fefdf8] border-black border-solid border-t-4 h-[355px] left-1/2 rounded-tl-[24px] rounded-tr-[24px] w-[390px]">
        {/* Quick-select chips */}
        <div className="absolute left-[29px] top-[24px] flex gap-[10px]">
          {QUICK_SELECT.map((opt) => {
            const isActive = totalMinutes === opt.minutes;
            return (
              <motion.button
                key={opt.label}
                onClick={() => handleQuickSelect(opt.minutes)}
                className="px-[20px] py-[8px] rounded-[20px] border-2 border-black font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[14px] cursor-pointer transition-all"
                style={{ backgroundColor: isActive ? "#beff6c" : "#f0f0f0" }}
                whileTap={{ scale: 0.95 }}
              >
                {opt.label}
              </motion.button>
            );
          })}
          <div className="flex items-center">
            <p className="font-['Work_Sans:Regular',sans-serif] text-[12px] text-black/60">or custom ↓</p>
          </div>
        </div>

        {/* Wheel Pickers */}
        <div className="absolute left-[29px] top-[80px] flex gap-[12px]">
          {/* Hours Picker */}
          <div className="bg-black h-[177px] w-[160px] rounded-[20px] flex flex-col items-center justify-between py-[9px]">
            <button onClick={incrementHours} className="cursor-pointer">
              <ChevronUp className="text-[#fefdf8]" size={22} />
            </button>
            <div className="bg-[#beff6c] h-[114px] w-[123px] rounded-[18px] flex flex-col items-center justify-center font-['Work_Sans:Medium',sans-serif] font-medium text-black text-center">
              <p className="text-[64px] leading-none">{String(hours).padStart(2, "0")}</p>
              <p className="text-[14px] leading-[16px] mt-[4px]">HOURS</p>
            </div>
            <button onClick={decrementHours} className="cursor-pointer">
              <ChevronDown className="text-[#fefdf8]" size={22} />
            </button>
          </div>

          {/* Minutes Picker */}
          <div className="bg-black h-[177px] w-[160px] rounded-[20px] flex flex-col items-center justify-between py-[9px]">
            <button onClick={incrementMinutes} className="cursor-pointer">
              <ChevronUp className="text-[#fefdf8]" size={22} />
            </button>
            <div className="bg-[#49dbc8] h-[114px] w-[123px] rounded-[18px] flex flex-col items-center justify-center font-['Work_Sans:Medium',sans-serif] font-medium text-black text-center">
              <p className="text-[64px] leading-none">{String(minutes).padStart(2, "0")}</p>
              <p className="text-[14px] leading-[16px] mt-[4px]">MINUTES</p>
            </div>
            <button onClick={decrementMinutes} className="cursor-pointer">
              <ChevronDown className="text-[#fefdf8]" size={22} />
            </button>
          </div>
        </div>

        <motion.button
          onClick={handleStart}
          disabled={totalMinutes === 0}
          className="-translate-x-1/2 absolute bg-black content-stretch flex gap-[12px] items-center justify-center left-[calc(50%+1px)] px-[77px] py-[14px] rounded-[24px] top-[285px] w-[335px] cursor-pointer hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.95 }}
        >
          <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
            {totalMinutes > 0
              ? `Enter the room (${totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ` : ""}${totalMinutes % 60 > 0 ? `${totalMinutes % 60}m` : ""})`
              : `Tackle that ${currentTask.name.toLowerCase()}!!`}
          </p>
        </motion.button>
      </div>
    </div>
  );
}
