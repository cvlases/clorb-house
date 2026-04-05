import { useNavigate } from "react-router";
import { motion } from "motion/react";
import svgPaths from "../../imports/IPhone161/svg-ccaepr95xw";
import imgUntitled500X500Px61 from "../../imports/IPhone161/749af56786e9c6161adfcf899904dec36b1941a5.png";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#7489ff] relative size-full overflow-hidden" data-name="iPhone 16 - 1">
      <div className="absolute h-[254px] left-[187px] top-[571px] w-[253px]" data-name="Chalk Style Shapes">
        <div className="absolute inset-[0_0_-7.91%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 253 274.097">
            <path d={svgPaths.pcec7b00} fill="var(--stroke-0, #B5A9FF)" id="Stacked rounded bars" />
          </svg>
        </div>
      </div>

      <div className="-translate-x-1/2 absolute bg-[#fefdf8] h-[542px] left-1/2 overflow-clip rounded-bl-[500px] rounded-br-[500px] top-[-66px] w-[461px]">
        <motion.div
          className="-translate-x-1/2 absolute left-[calc(50%+0.5px)] size-[120px] top-[462px]"
          data-name="Untitled_500_x_500_px_6 1"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img alt="Clorb character waving" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
        </motion.div>
      </div>

      <p className="-translate-x-1/2 absolute font-['Kodchasan:Bold',sans-serif] leading-[0] left-[calc(50%+0.5px)] not-italic text-[#020202] text-[0px] text-center top-[256px] tracking-[-0.96px] w-[350px]">
        <span className="leading-[1.1] text-[36px]">
          Welcome to
          <br aria-hidden="true" />
        </span>
        <span className="leading-[1.1] text-[48px]">the Clorb!</span>
      </p>

      <motion.button
        onClick={() => navigate("/meet")}
        className="-translate-x-1/2 absolute bg-black content-stretch flex gap-[12px] items-center justify-center left-1/2 px-[77px] py-[14px] rounded-[24px] top-[714px] w-[335px] cursor-pointer hover:bg-[#333] transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">Start</p>
      </motion.button>
    </div>
  );
}
