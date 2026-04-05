import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import imgUntitled500X500Px61 from "../../imports/IPhone161/749af56786e9c6161adfcf899904dec36b1941a5.png";

export default function Funeral() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const timeLeft = parseInt(searchParams.get("timeLeft") || "0");
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timeText =
    minutes > 0
      ? `${minutes}m ${String(seconds).padStart(2, "0")}s`
      : `${seconds} seconds`;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="bg-[#1a1a1a] relative size-full overflow-hidden flex items-center justify-center">
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Spotlight radial gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 40%, #2a2a2a 0%, #0a0a0a 60%, #000 100%)" }}
        />

        {/* Main content */}
        <motion.div
          className="relative z-10 flex flex-col items-center"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring", damping: 14 }}
        >
          {/* Clorb with headstone */}
          <div className="relative mb-[32px]">
            <motion.div
              className="size-[180px]"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                alt="Clorb at funeral"
                src={imgUntitled500X500Px61}
                className="w-full h-full object-contain grayscale opacity-50"
              />
            </motion.div>

            {/* Headstone */}
            <motion.div
              className="absolute -bottom-[24px] left-1/2 -translate-x-1/2"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, type: "spring", damping: 10 }}
            >
              <div className="bg-gray-600 border-2 border-gray-800 rounded-t-[10px] w-[64px] h-[80px] flex flex-col items-center justify-center gap-[2px]">
                <p className="text-white text-[20px]">⚰️</p>
                <p className="text-white text-[11px] font-['Work_Sans:Bold',sans-serif] font-bold">RIP</p>
                <p className="text-white text-[8px] font-['Work_Sans:Regular',sans-serif]">Task</p>
              </div>
            </motion.div>
          </div>

          <motion.p
            className="font-['Kodchasan:Bold',sans-serif] text-[36px] text-white text-center tracking-[-0.72px] mb-[8px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            Clorb Funeral
          </motion.p>

          <motion.p
            className="font-['Work_Sans:Medium',sans-serif] text-[16px] text-gray-400 text-center max-w-[280px] leading-[1.5]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
          >
            The task was abandoned with{" "}
            <span className="text-white font-bold">{timeText}</span> remaining.
            <br />
            May it rest in pieces.
          </motion.p>

          {/* Candles */}
          <motion.div
            className="flex gap-[20px] mt-[28px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="text-[28px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
              >
                🕯️
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        <motion.p
          className="absolute bottom-[36px] font-['Work_Sans:Regular',sans-serif] text-[13px] text-gray-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5 }}
        >
          Returning to start...
        </motion.p>
      </motion.div>
    </div>
  );
}
