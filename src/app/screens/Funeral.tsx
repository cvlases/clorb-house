import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState } from "react";
import imgUntitled500X500Px61 from "../../imports/IPhone161/749af56786e9c6161adfcf899904dec36b1941a5.png";

export default function Funeral() {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [showFuneral, setShowFuneral] = useState(false);

  const handleCancel = () => {
    navigate(-1); // Go back to execution room
  };

  const handleConfirmGiveUp = () => {
    setShowConfirmation(false);
    setShowFuneral(true);
    
    setTimeout(() => {
      navigate("/");
    }, 4000);
  };

  return (
    <div className="bg-[#1a1a1a] relative size-full overflow-hidden flex items-center justify-center">
      {showConfirmation && (
        <motion.div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-[#fefdf8] border-4 border-black rounded-[24px] p-[32px] max-w-[340px] mx-[20px] shadow-[8px_8px_0_0_#000]"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <p className="font-['Kodchasan:Bold',sans-serif] text-[28px] text-black text-center mb-[16px] tracking-[-0.56px]">
              Are you sure?
            </p>
            
            <p className="font-['Work_Sans:Medium',sans-serif] text-[18px] text-black text-center mb-[24px]">
              Clorb only had 4 minutes left to clean...
            </p>

            <div className="flex items-center justify-center mb-[24px]">
              <motion.div
                className="size-[120px]"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img alt="Sad Clorb" src={imgUntitled500X500Px61} className="w-full h-full object-contain opacity-70" />
              </motion.div>
            </div>

            <div className="flex gap-[12px]">
              <motion.button
                onClick={handleCancel}
                className="flex-1 bg-[#beff6c] border-2 border-black rounded-[16px] py-[12px] px-[20px] cursor-pointer hover:shadow-[4px_4px_0_0_#000] transition-all"
                whileTap={{ scale: 0.95 }}
              >
                <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[16px] text-black text-center">
                  Keep Going
                </p>
              </motion.button>

              <motion.button
                onClick={handleConfirmGiveUp}
                className="flex-1 bg-[#ff576a] border-2 border-black rounded-[16px] py-[12px] px-[20px] cursor-pointer hover:shadow-[4px_4px_0_0_#000] transition-all"
                whileTap={{ scale: 0.95 }}
              >
                <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[16px] text-black text-center">
                  Give Up
                </p>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {showFuneral && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Spotlight effect */}
          <div className="absolute inset-0 bg-gradient-radial from-gray-800 via-black to-black" />

          {/* Sad Clorb in spotlight */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              className="size-[200px] mb-[24px]"
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <img alt="Clorb at funeral" src={imgUntitled500X500Px61} className="w-full h-full object-contain grayscale opacity-60" />
                
                {/* Tiny headstone */}
                <motion.div
                  className="absolute -bottom-[20px] left-1/2 -translate-x-1/2"
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, type: "spring", damping: 10 }}
                >
                  <div className="bg-gray-600 border-2 border-gray-800 rounded-t-[8px] w-[60px] h-[80px] flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-500 to-gray-700 rounded-t-[8px] opacity-50" />
                    <p className="relative text-white text-[24px] mb-[4px]">⚰️</p>
                    <p className="relative text-white text-[10px] font-['Work_Sans:Bold',sans-serif] font-bold">RIP</p>
                    <p className="relative text-white text-[8px] font-['Work_Sans:Regular',sans-serif]">Task</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.p
              className="font-['Kodchasan:Bold',sans-serif] text-[32px] text-white text-center tracking-[-0.64px] mb-[12px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              Clorb Funeral
            </motion.p>

            <motion.p
              className="font-['Work_Sans:Medium',sans-serif] text-[16px] text-gray-400 text-center max-w-[300px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              The task was abandoned.<br />
              May it rest in pieces.
            </motion.p>

            {/* Candles */}
            <div className="flex gap-[20px] mt-[32px]">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="text-[32px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.8 + i * 0.2 }}
                >
                  🕯️
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p
            className="absolute bottom-[40px] font-['Work_Sans:Regular',sans-serif] text-[14px] text-gray-500 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            Returning to start...
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
