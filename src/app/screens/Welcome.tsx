import { useNavigate } from "react-router";
import { motion } from "motion/react";
import imgClorb from "../../imports/IPhone161/749af56786e9c6161adfcf899904dec36b1941a5.png";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#7489ff] relative size-full overflow-hidden flex flex-col items-center justify-between py-[10dvh]">
      {/* Top decorative oval */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#fefdf8] rounded-b-[50%] overflow-hidden"
        style={{ width: "120%", height: "58dvh" }}
      >
        {/* Clorb inside oval */}
        <motion.img
          alt="Clorb character waving"
          src={imgClorb}
          className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[28dvh] h-[28dvh] object-contain pointer-events-none"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col items-center text-center mt-[60dvh]">
        <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: "clamp(28px, 8vw, 36px)", lineHeight: 1.1, color: "#020202", letterSpacing: "-0.72px" }}>
          Welcome to
        </p>
        <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 11vw, 48px)", lineHeight: 1.1, color: "#020202", letterSpacing: "-0.96px" }}>
          the Clorbhouse!
        </p>
      </div>

      {/* Button */}
      <motion.button
        onClick={() => navigate("/meet")}
        className="relative z-10 bg-black rounded-[24px] px-[24px] py-[14px] w-[85%] max-w-[335px] cursor-pointer hover:bg-[#333] transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 500, fontSize: 16, color: "white", textAlign: "center" }}>
          Start
        </p>
      </motion.button>
    </div>
  );
}
