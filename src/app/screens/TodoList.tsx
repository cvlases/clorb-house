import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import imgImg065921 from "../../imports/IPhone165/8ed2eefc22017c6fe97892a6d10d9c37e1f82d6d.png";
import imgUntitled500X500Px61 from "../../imports/IPhone165/749af56786e9c6161adfcf899904dec36b1941a5.png";
import svgPaths from "../../imports/IPhone165/svg-kfaj6v6rpn";
import { TASKS } from "../constants/tasks";

const rooms = [
  { id: "frequent", name: "Frequent", active: true },
  { id: "kitchen", name: "Kitchen", active: false },
  { id: "bedroom", name: "Bedroom", active: false },
  { id: "office", name: "Office", active: false },
];

export default function TodoList() {
  const navigate = useNavigate();

  const handleTaskClick = (taskId: string) => {
    navigate(`/task-select/${taskId}`);
  };

  return (
    <div className="bg-[#fff85a] relative size-full overflow-hidden" data-name="iPhone 16 - 5">
      <div className="absolute h-[706px] left-[-1px] top-[-37px] w-[394px]" data-name="IMG_0659 2 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg065921} />
      </div>

      <div className="absolute left-[176px] size-[102px] top-[483px]" data-name="Untitled_500_x_500_px_6 1">
        <img alt="Clorb character" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
      </div>

      {/* To Do List Panel */}
      <div className="-translate-x-1/2 absolute left-1/2 bottom-0 bg-white border-black border-solid border-t-4 rounded-tl-[24px] rounded-tr-[24px] w-[393px] h-[183px]">
        <div className="-translate-x-1/2 absolute h-[16px] left-[calc(50%-3.04px)] top-[18px] w-[21.216px]">
          <div className="absolute bottom-1/4 left-[16.34%] right-[16.34%] top-[8.06%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.281 10.7099">
              <path d={svgPaths.p19d7bc80} fill="var(--fill-0, #020202)" id="Polygon 2" />
            </svg>
          </div>
        </div>

        <p className="-translate-x-1/2 absolute font-['Work_Sans:SemiBold',sans-serif] font-semibold leading-[28px] left-[calc(50%+0.68px)] text-[20px] text-black text-center top-[25.74px] whitespace-nowrap">To Do List</p>

        {/* Task Icons */}
        <div className="absolute left-[30px] top-[75px] flex gap-[16px]">
          {TASKS.map((task) => (
            <motion.button
              key={task.id}
              onClick={() => handleTaskClick(task.id)}
              className="flex flex-col items-center gap-[8px] cursor-pointer"
              whileTap={{ scale: 0.9 }}
            >
              <div
                className="size-[48px] rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0_0_#000]"
                style={{ backgroundColor: task.color }}
              >
                <span className="text-[24px]">{task.emoji}</span>
              </div>
              <p className="font-['Work_Sans:Regular',sans-serif] text-[10px] text-black text-center w-[54px] leading-[12px]">
                {task.name}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="-translate-x-1/2 absolute bg-black content-stretch flex gap-[8px] items-center left-[calc(50%+0.5px)] pl-px pr-[8px] py-px rounded-[20px] top-[19px] w-[192px]">
        <div className="bg-[#42aaff] content-stretch flex items-center justify-center p-[8px] relative rounded-[18px] shrink-0 w-[88px]">
          <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">Clorb Room</p>
        </div>
        <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[12px] text-center text-white w-[75px]">Clorb House</p>
      </div>
    </div>
  );
}