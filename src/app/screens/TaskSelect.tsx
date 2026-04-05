import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import svgPaths from "../../imports/IPhone167/svg-m55s6437nw";
import imgUntitled500X500Px61 from "../../imports/IPhone167/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { getTaskById } from "../constants/tasks";

export default function TaskSelect() {
  const navigate = useNavigate();
  const { task } = useParams<{ task: string }>();
  const [clorbCount, setClorbCount] = useState(0);

  const currentTask = getTaskById(task);

  useEffect(() => {
    // Animate the clorb count
    const targetCount = currentTask.clorbCount;
    let current = 0;
    const increment = Math.ceil(targetCount / 30);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetCount) {
        setClorbCount(targetCount);
        clearInterval(timer);
      } else {
        setClorbCount(current);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [currentTask.clorbCount]);

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden" data-name="iPhone 16 - 7">
      <div className="-translate-x-1/2 absolute h-[1093px] left-[calc(50%+24.5px)] top-[-126px] w-[2094px]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2096 1095">
          <g filter="url(#filter0_g_1_1126)" id="Vector">
            <path d={svgPaths.p1d6c8040} stroke="var(--stroke-0, #F6EFCD)" strokeWidth="1.5" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="1095" id="filter0_g_1_1126" width="2096" x="-2.1791e-08" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape" />
              <feTurbulence baseFrequency="0.99900001287460327 0.99900001287460327" numOctaves="3" seed="1194" type="fractalNoise" />
              <feDisplacementMap height="100%" in="shape" result="displacedImage" scale="2" width="100%" xChannelSelector="R" yChannelSelector="G" />
              <feMerge result="effect1_texture_1_1126">
                <feMergeNode in="displacedImage" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      <p className="-translate-x-1/2 absolute font-['Kodchasan:Bold',sans-serif] leading-[1.1] left-[calc(50%+0.5px)] not-italic text-[#020202] text-[36px] text-center top-[58px] tracking-[-0.72px] w-[350px]">Welcome, Clorb!</p>
      
      <p className="-translate-x-1/2 absolute bottom-[82.35%] font-['Work_Sans:Medium',sans-serif] font-medium leading-[1.1] left-[calc(50%+0.5px)] text-[20px] text-black text-center top-[15.05%] w-[294px]">
        Join us as we all do {currentTask.name}!
      </p>

      {/* Social Proof Badge */}
      <motion.div
        className="-translate-x-1/2 absolute bg-[#beff6c] content-stretch flex gap-[8px] items-center justify-center left-[calc(50%+1px)] px-[16px] py-[8px] rounded-[18px] top-[164px] border border-black"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="overflow-clip relative shrink-0 size-[20px]" data-name="Graph">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
            <g id="Vector" />
          </svg>
          <div className="absolute inset-[29.17%_12.5%]" data-name="Vector">
            <div className="absolute inset-[-9%_-5%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5 9.83333">
                <path d={svgPaths.p29de6e50} id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-[29.17%_12.5%_41.67%_58.33%]" data-name="Vector">
            <div className="absolute inset-[-12.86%]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7.33333 7.33333">
                <path d="M0.75 0.75H6.58333V6.58333" id="Vector" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[0px] text-black text-center whitespace-nowrap">
          <span className="font-['Work_Sans:Bold',sans-serif] font-bold leading-[20px] text-[14px]">{clorbCount}</span>
          <span className="leading-[20px] text-[14px]"> Clorbs Now</span>
        </p>
      </motion.div>

      {/* Clorb Characters */}
      <motion.div
        className="-translate-x-1/2 absolute left-[calc(50%-81px)] size-[165px] top-[461px]"
        animate={{ x: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <img alt="Clorb" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
      </motion.div>

      <motion.div
        className="-translate-x-1/2 absolute left-[calc(50%+3px)] size-[129px] top-[266px]"
        animate={{ rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img alt="Clorb" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
      </motion.div>

      <motion.div
        className="-translate-x-1/2 absolute left-[calc(50%+52px)] size-[129px] top-[331px]"
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img alt="Clorb" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
      </motion.div>

      <motion.div
        className="-translate-x-1/2 absolute left-[calc(50%+111px)] size-[129px] top-[395px]"
        animate={{ x: [5, -5, 5] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img alt="Clorb" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
      </motion.div>

      <motion.button
        onClick={() => navigate(`/time-select/${task}`)}
        className="-translate-x-1/2 absolute bg-black content-stretch flex gap-[12px] items-center justify-center left-[calc(50%+1px)] px-[77px] py-[14px] rounded-[24px] top-[714px] w-[335px] cursor-pointer hover:bg-[#333] transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
          Join the {currentTask.name} clorb
        </p>
      </motion.button>
    </div>
  );
}