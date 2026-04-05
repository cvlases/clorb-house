import { useNavigate } from "react-router";
import { motion } from "motion/react";
import svgPaths from "../../imports/IPhone163/svg-pknc01jnfz";
import imgUntitled500X500Px61 from "../../imports/IPhone163/749af56786e9c6161adfcf899904dec36b1941a5.png";

export default function MeetClorb() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden" data-name="iPhone 16 - 3">
      <div className="-translate-x-1/2 absolute h-[1093px] left-[calc(50%+24px)] top-[-126px] w-[2094px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2096 1095">
          <g filter="url(#filter0_g_1_1104)" id="Vector">
            <path d={svgPaths.p1d6c8040} stroke="var(--stroke-0, #F6EFCD)" strokeWidth="1.5" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1095" id="filter0_g_1_1104" width="2096" x="-2.1791e-08" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="1194" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="2" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_1104">
                <feMergeNode in="displacedImage" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <p className="-translate-x-1/2 absolute font-['Kodchasan:Bold',sans-serif] leading-[1.1] left-1/2 not-italic text-[#020202] text-[48px] text-center top-[91px] tracking-[-0.96px] w-[350px]">Meet Clorb!</p>
      
      <p className="-translate-x-1/2 absolute bottom-[68.13%] font-['Work_Sans:Medium',sans-serif] font-medium leading-[1.1] left-1/2 text-[20px] text-black text-center top-[18.84%] w-[318px]">Your new neighbor... They'd like to be your task buddy. You can do everything together! Because everything is more fun when you're not alone.</p>
      
      <motion.div
        className="-translate-x-1/2 absolute left-[calc(50%+13px)] size-[268px] top-[355px]"
        data-name="Untitled_500_x_500_px_6 1"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img alt="Clorb character" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
      </motion.div>

      <motion.button
        onClick={() => navigate("/todo")}
        className="-translate-x-1/2 absolute bg-black content-stretch flex gap-[12px] items-center justify-center left-[calc(50%+2.5px)] px-[77px] py-[14px] rounded-[24px] top-[714px] w-[335px] cursor-pointer hover:bg-[#333] transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">Enter Clorbhouse</p>
      </motion.button>
    </div>
  );
}
