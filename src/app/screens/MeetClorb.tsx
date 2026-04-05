import { useNavigate } from "react-router";
import { motion } from "motion/react";
import imgClorb from "../../imports/IPhone163/749af56786e9c6161adfcf899904dec36b1941a5.png";

export default function MeetClorb() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden flex flex-col items-center justify-between py-[8dvh] px-[24px]">
      {/* Heading */}
      <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: "clamp(36px, 10vw, 48px)", lineHeight: 1.1, color: "#020202", letterSpacing: "-0.96px", textAlign: "center" }}>
        Meet Clorb!
      </p>

      {/* Subtitle */}
      <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 500, fontSize: "clamp(15px, 4vw, 20px)", lineHeight: 1.4, color: "black", textAlign: "center", maxWidth: 318 }}>
        Your new neighbor... They'd like to be your task buddy. You can do everything together! Because everything is more fun when you're not alone.
      </p>

      {/* Clorb character */}
      <motion.img
        alt="Clorb character"
        src={imgClorb}
        className="w-[40dvh] h-[40dvh] max-w-[268px] max-h-[268px] object-contain pointer-events-none"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Button */}
      <motion.button
        onClick={() => navigate("/todo")}
        className="bg-black rounded-[24px] px-[24px] py-[14px] w-full max-w-[335px] cursor-pointer hover:bg-[#333] transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 500, fontSize: 16, color: "white", textAlign: "center" }}>
          Enter Clorbhouse
        </p>
      </motion.button>
    </div>
  );
}
