import svgPaths from "./svg-ccaepr95xw";
import imgUntitled500X500Px61 from "./749af56786e9c6161adfcf899904dec36b1941a5.png";

function Frame() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#fefdf8] h-[542px] left-1/2 overflow-clip rounded-bl-[500px] rounded-br-[500px] top-[-66px] w-[461px]">
      <div className="-translate-x-1/2 absolute left-[calc(50%+0.5px)] size-[120px] top-[462px]" data-name="Untitled_500_x_500_px_6 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgUntitled500X500Px61} />
      </div>
    </div>
  );
}

export default function IPhone() {
  return (
    <div className="bg-[#7489ff] relative size-full" data-name="iPhone 16 - 1">
      <div className="absolute h-[254px] left-[187px] top-[571px] w-[253px]" data-name="Chalk Style Shapes">
        <div className="absolute inset-[0_0_-7.91%_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 253 274.097">
            <path d={svgPaths.pcec7b00} fill="var(--stroke-0, #B5A9FF)" id="Stacked rounded bars" />
          </svg>
        </div>
      </div>
      <Frame />
      <p className="-translate-x-1/2 absolute font-['Kodchasan:Bold',sans-serif] leading-[0] left-[calc(50%+0.5px)] not-italic text-[#020202] text-[0px] text-center top-[256px] tracking-[-0.96px] w-[350px]">
        <span className="leading-[1.1] text-[36px]">
          Welcome to
          <br aria-hidden="true" />
        </span>
        <span className="leading-[1.1] text-[48px]">the Clorb!</span>
      </p>
    </div>
  );
}