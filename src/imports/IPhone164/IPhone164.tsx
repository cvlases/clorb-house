import svgPaths from "./svg-3pymkdj46c";
import imgClorbExample2 from "./f0cb2429479350fc5d0fd07f659969f659d27e2b.png";

function Group() {
  return (
    <div className="-translate-x-1/2 absolute contents left-1/2 top-0">
      <div className="-translate-x-1/2 absolute h-[99.983px] left-[calc(50%-53.78px)] top-0 w-[90.924px]" data-name="Clorb Example 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgClorbExample2} />
      </div>
      <div className="-translate-x-1/2 absolute flex h-[80.138px] items-center justify-center left-[calc(50%+5.23px)] top-[19.7px] w-[72.877px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[80.138px] relative w-[72.877px]" data-name="Clorb Example 3">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgClorbExample2} />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute flex h-[69.837px] items-center justify-center left-[calc(50%+126.58px)] top-[30.16px] w-[63.509px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[69.837px] relative w-[63.509px]" data-name="Clorb Example 6">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgClorbExample2} />
          </div>
        </div>
      </div>
      <div className="-translate-x-1/2 absolute h-[99.983px] left-[calc(50%+78.04px)] top-0 w-[90.924px]" data-name="Clorb Example 5">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgClorbExample2} />
      </div>
      <div className="-translate-x-1/2 absolute flex h-[80.138px] items-center justify-center left-[calc(50%-121.89px)] top-[19.7px] w-[72.877px]">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[80.138px] relative w-[72.877px]" data-name="Clorb Example 4">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgClorbExample2} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute h-[100px] left-[2.49px] top-[138px] w-[316.667px]">
      <Group />
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute h-[238px] left-[42.68px] top-[270px] w-[333.39px]" data-name="Logo">
      <div className="absolute flex h-[107.108px] items-center justify-center left-[227.32px] top-0 w-[106.072px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[23.51deg]">
          <div className="h-[82px] relative w-[80px]" data-name="Fill Shapes">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 80 82">
              <path d={svgPaths.p2680e500} fill="var(--fill-0, #FFD76A)" id="Eight-point star" />
            </svg>
          </div>
        </div>
      </div>
      <p className="-translate-x-1/2 absolute font-['Kodchasan:Bold',sans-serif] leading-[1.1] left-[calc(50%-5.56px)] not-italic text-[#020202] text-[83.626px] text-center top-[35.47px] tracking-[-1.6725px] whitespace-nowrap">Clorb</p>
      <div className="-translate-x-1/2 absolute flex h-[72.008px] items-center justify-center left-[calc(50%-124.59px)] top-[3px] w-[84.205px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-[-28.85deg]">
          <p className="font-['Kodchasan:Bold',sans-serif] leading-[1.1] not-italic relative text-[#020202] text-[38.596px] text-center tracking-[-0.7719px] whitespace-nowrap">The</p>
        </div>
      </div>
      <Frame />
    </div>
  );
}

export default function IPhone() {
  return (
    <div className="bg-[#fefdf8] relative size-full" data-name="iPhone 16 - 4">
      <div className="absolute flex h-[173px] items-center justify-center left-[103px] top-[-43px] w-[184px]">
        <div className="flex-none rotate-180">
          <div className="h-[173px] relative w-[184px]" data-name="Fill Shapes">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 184 173">
              <path d={svgPaths.p2176e280} fill="var(--fill-0, #FF7CD8)" id="Double-bulge capsule" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[173px] items-center justify-center left-[103px] top-[681px] w-[184px]">
        <div className="flex-none rotate-180">
          <div className="h-[173px] relative w-[184px]" data-name="Fill Shapes">
            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 184 173">
              <path d={svgPaths.p2176e280} fill="var(--fill-0, #94ADFF)" id="Double-bulge capsule" />
            </svg>
          </div>
        </div>
      </div>
      <Logo />
    </div>
  );
}