import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { getCollectedItems, CollectedItem } from "../hooks/useGameState";

const rarityColors: Record<string, string> = {
  common: "#E8E8E8",
  uncommon: "#6ee86e",
  rare: "#69b4ff",
  legendary: "#FFD700",
};

const rarityOrder: Record<string, number> = {
  legendary: 0,
  rare: 1,
  uncommon: 2,
  common: 3,
};

const BOUNTY_BOARD = [
  {
    name: "The Mise en Place Bundle",
    recipe: "3× Dry Macaroni + 1× Slightly Damp Sponge",
    reward: "15% discount code for a specialty spice retailer",
    emoji: "🧂",
  },
  {
    name: "The Design Sprint Survivor",
    recipe: "3× Used Sticky Note + 1× Empty Coffee Cup",
    reward: "$5 credit for a digital asset store (fonts, UI kits...)",
    emoji: "🎨",
  },
  {
    name: "The Polyglot Pack",
    recipe: "4× Crumpled Flashcard + 1× Stale Baguette",
    reward: "1-month premium language learning subscription",
    emoji: "🗣️",
  },
  {
    name: "The Commuter's Relief",
    recipe: "2× Expired Parking Ticket + 1× Mysterious Lost Key",
    reward: "Free premium car wash coupon",
    emoji: "🚗",
  },
  {
    name: "The Laundry Day Haul",
    recipe: "5× Holey Socks + 1× Vintage Bottlecap",
    reward: "$2 digital Amazon coupon for laundry detergent",
    emoji: "🧺",
  },
  {
    name: "The Date Night Stash",
    recipe: "2× Argyle Sock + 1× Melted Chocolate Bar",
    reward: "Buy-One-Get-One AMC movie ticket voucher",
    emoji: "🎬",
  },
];

export default function Shelf() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CollectedItem[]>([]);
  const [activeTab, setActiveTab] = useState<"shelf" | "bounty">("shelf");
  const [newestItemId, setNewestItemId] = useState<string | null>(null);

  useEffect(() => {
    const collected = getCollectedItems();
    const sorted = [...collected].sort(
      (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity] || b.collectedAt - a.collectedAt
    );
    setItems(sorted);
    if (sorted.length > 0) {
      setNewestItemId(sorted.find((i) => i.collectedAt === Math.max(...sorted.map((x) => x.collectedAt)))?.id ?? null);
    }
  }, []);

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-[12px] px-[20px] pt-[20px] pb-[12px] border-b-2 border-black shrink-0">
        <button
          onClick={() => navigate("/todo")}
          className="size-[36px] rounded-full bg-black flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <p className="font-['Kodchasan:Bold',sans-serif] text-[22px] text-black tracking-[-0.44px] leading-[1.1]">
            Clorb House
          </p>
          <p className="font-['Work_Sans:Regular',sans-serif] text-[12px] text-black/60">
            {items.length} item{items.length !== 1 ? "s" : ""} collected
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0 border-b-2 border-black shrink-0">
        {(["shelf", "bounty"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-[10px] font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[13px] text-center cursor-pointer transition-colors"
            style={{
              backgroundColor: activeTab === tab ? "#beff6c" : "transparent",
              borderBottom: activeTab === tab ? "2px solid black" : "none",
            }}
          >
            {tab === "shelf" ? "🗄️ My Shelf" : "📋 Bounty Board"}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "shelf" && (
        <div className="flex-1 overflow-y-auto px-[16px] py-[16px]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-[16px] pb-[60px]">
              <p className="text-[64px]">📦</p>
              <p className="font-['Kodchasan:Bold',sans-serif] text-[22px] text-black text-center tracking-[-0.44px]">
                Your shelf is empty.
              </p>
              <p className="font-['Work_Sans:Medium',sans-serif] text-[15px] text-black/60 text-center max-w-[260px]">
                Complete tasks to collect absurd items. They're yours forever. Probably useless. Definitely precious.
              </p>
              <button
                onClick={() => navigate("/todo")}
                className="mt-[8px] bg-black text-white font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[14px] px-[28px] py-[12px] rounded-[20px] cursor-pointer"
              >
                Start a Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[10px]">
              {items.map((item) => {
                const isNew = item.id === newestItemId;
                return (
                  <motion.div
                    key={item.id}
                    className="rounded-[16px] border-2 border-black p-[10px] flex flex-col items-center gap-[6px] shadow-[2px_2px_0_0_#000]"
                    style={{ backgroundColor: rarityColors[item.rarity] ?? "#E8E8E8" }}
                    initial={isNew ? { scale: 0.5, opacity: 0, y: -20 } : { scale: 1, opacity: 1 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={isNew ? { type: "spring", damping: 12, delay: 0.1 } : {}}
                  >
                    <span className="text-[32px]">{item.emoji}</span>
                    <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[9px] text-black text-center leading-[12px]">
                      {item.name}
                    </p>
                    <div className="bg-black/20 px-[6px] py-[2px] rounded-[6px]">
                      <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[8px] text-black uppercase tracking-wide">
                        {item.rarity}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "bounty" && (
        <div className="flex-1 overflow-y-auto px-[16px] py-[16px]">
          <p className="font-['Work_Sans:Medium',sans-serif] text-[13px] text-black/60 text-center mb-[12px] leading-[1.4]">
            Trade your collected items for real-world rewards.<br />
            <span className="italic">Coming soon — keep collecting!</span>
          </p>
          <div className="flex flex-col gap-[12px]">
            {BOUNTY_BOARD.map((bounty) => (
              <div
                key={bounty.name}
                className="bg-white border-2 border-black rounded-[16px] p-[14px] shadow-[2px_2px_0_0_#000]"
              >
                <div className="flex items-start gap-[10px]">
                  <span className="text-[28px] shrink-0">{bounty.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[13px] text-black leading-[1.3] mb-[4px]">
                      {bounty.name}
                    </p>
                    <p className="font-['Work_Sans:Regular',sans-serif] text-[11px] text-black/60 leading-[1.4] mb-[6px]">
                      🧪 {bounty.recipe}
                    </p>
                    <p className="font-['Work_Sans:Medium',sans-serif] text-[11px] text-black leading-[1.4]">
                      🎁 {bounty.reward}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {activeTab === "shelf" && items.length > 0 && (
        <div className="px-[16px] py-[12px] border-t-2 border-black shrink-0 bg-[#fefdf8]">
          <button
            onClick={() => navigate("/todo")}
            className="w-full bg-black text-white font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[15px] py-[14px] rounded-[20px] cursor-pointer hover:bg-[#333] transition-colors"
          >
            Start Another Task
          </button>
        </div>
      )}
    </div>
  );
}
