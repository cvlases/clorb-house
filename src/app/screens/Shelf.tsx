import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { getCollectedItems, CollectedItem } from "../hooks/useGameState";
import { COLLECTIBLE_ASSETS } from "../constants/taskConfig";

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

// ─── Noticeboard (formerly Bounty Board) ─────────────────────────────────────

interface Bounty {
  id: string;
  name: string;
  recipe: string;
  reward: string;
  emoji: string;
  claimed: boolean;
}

const INITIAL_BOUNTIES: Omit<Bounty, "claimed">[] = [
  {
    id: "mise",
    name: "The Mise en Place Bundle",
    recipe: "3× Dry Macaroni + 1× Slightly Damp Sponge",
    reward: "15% discount at a specialty spice retailer",
    emoji: "🧂",
  },
  {
    id: "design",
    name: "The Design Sprint Survivor",
    recipe: "3× Used Sticky Note + 1× Empty Coffee Cup",
    reward: "$5 credit for a digital asset store (fonts, UI kits...)",
    emoji: "🎨",
  },
  {
    id: "polyglot",
    name: "The Polyglot Pack",
    recipe: "4× Crumpled Flashcard + 1× Stale Baguette",
    reward: "1-month premium language learning subscription",
    emoji: "🗣️",
  },
  {
    id: "commuter",
    name: "The Commuter's Relief",
    recipe: "2× Expired Parking Ticket + 1× Mysterious Lost Key",
    reward: "Free premium car wash coupon",
    emoji: "🚗",
  },
  {
    id: "laundry",
    name: "The Laundry Day Haul",
    recipe: "5× Holey Socks + 1× Vintage Bottlecap",
    reward: "$2 Amazon coupon for laundry detergent",
    emoji: "🧺",
  },
  {
    id: "datenight",
    name: "The Date Night Stash",
    recipe: "2× Argyle Sock + 1× Melted Chocolate Bar",
    reward: "Buy-One-Get-One AMC movie ticket voucher",
    emoji: "🎬",
  },
];

// Chunk array into rows of N items
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export default function Shelf() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CollectedItem[]>([]);
  const [activeTab, setActiveTab] = useState<"shelf" | "noticeboard">("shelf");
  const [newestItemId, setNewestItemId] = useState<string | null>(null);
  const [bounties, setBounties] = useState<Bounty[]>(() =>
    INITIAL_BOUNTIES.map((b) => ({ ...b, claimed: false }))
  );

  useEffect(() => {
    const collected = getCollectedItems();
    const sorted = [...collected].sort(
      (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity] || b.collectedAt - a.collectedAt
    );
    setItems(sorted);
    if (sorted.length > 0) {
      const latest = sorted.reduce((a, b) => (a.collectedAt > b.collectedAt ? a : b));
      setNewestItemId(latest.id);
    }
  }, []);

  const handleClaim = (bountyId: string) => {
    setBounties((prev) =>
      prev.map((b) => (b.id === bountyId ? { ...b, claimed: true } : b))
    );
  };

  const shelfRows = chunkArray(items, 3);

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden flex flex-col">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-[12px] px-[20px] pt-[20px] pb-[12px] border-b-2 border-black shrink-0">
        <button
          onClick={() => navigate("/todo")}
          className="size-[36px] rounded-full bg-black flex items-center justify-center cursor-pointer shrink-0"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div>
          <p className="font-['Kodchasan:Bold',sans-serif] text-[22px] text-black tracking-[-0.44px] leading-[1.1]">
            Clorb's Collections
          </p>
          <p className="font-['Work_Sans:Regular',sans-serif] text-[12px] text-black/60">
            {items.length} item{items.length !== 1 ? "s" : ""} collected
          </p>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex border-b-2 border-black shrink-0">
        {(["shelf", "noticeboard"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-[10px] font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[13px] text-center cursor-pointer transition-colors"
            style={{ backgroundColor: activeTab === tab ? "#beff6c" : "transparent" }}
          >
            {tab === "shelf" ? "🗄️ My Shelf" : "📌 The Clorb Noticeboard"}
          </button>
        ))}
      </div>

      {/* ── My Shelf ───────────────────────────────────────────────────── */}
      {activeTab === "shelf" && (
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-[16px] pb-[60px] px-[24px]">
              <p className="font-['Kodchasan:Bold',sans-serif] text-[22px] text-black text-center tracking-[-0.44px]">
                Your shelf awaits.
              </p>
              <p className="font-['Work_Sans:Medium',sans-serif] text-[14px] text-black/60 text-center max-w-[260px]">
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
            <div className="pb-[24px]">
              {shelfRows.map((row, rowIdx) => (
                <div key={rowIdx} className="relative">
                  {/* Items sitting on the shelf */}
                  <div className="flex justify-around items-end px-[16px] pt-[20px] pb-[0px]">
                    {row.map((item) => {
                      const isNew = item.id === newestItemId;
                      const assetSrc = COLLECTIBLE_ASSETS[item.name];

                      return (
                        <motion.div
                          key={item.id}
                          className="flex flex-col items-center gap-[6px]"
                          style={{ width: "30%" }}
                          initial={isNew ? { scale: 0.4, opacity: 0, y: -30 } : false}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={
                            isNew
                              ? { type: "spring", damping: 10, stiffness: 200, delay: 0.1 }
                              : {}
                          }
                        >
                          {/* Item image or rarity-colored fallback */}
                          <div className="relative">
                            {assetSrc ? (
                              <img
                                src={assetSrc}
                                alt={item.name}
                                className="w-[72px] h-[72px] object-contain drop-shadow-md"
                              />
                            ) : (
                              <div
                                className="w-[72px] h-[72px] rounded-[12px] border-2 border-black flex items-center justify-center text-[36px]"
                                style={{ backgroundColor: rarityColors[item.rarity] ?? "#E8E8E8" }}
                              >
                                {item.emoji}
                              </div>
                            )}
                            {/* Rarity dot */}
                            <div
                              className="absolute -top-[4px] -right-[4px] w-[12px] h-[12px] rounded-full border border-black"
                              style={{ backgroundColor: rarityColors[item.rarity] ?? "#ccc" }}
                            />
                          </div>
                          <p
                            className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[9px] text-black text-center leading-[12px]"
                            style={{ maxWidth: 72 }}
                          >
                            {item.name}
                          </p>
                        </motion.div>
                      );
                    })}

                    {/* Fill empty slots in last row */}
                    {row.length < 3 &&
                      Array.from({ length: 3 - row.length }).map((_, i) => (
                        <div key={`empty-${i}`} style={{ width: "30%" }} />
                      ))}
                  </div>

                  {/* Shelf plank */}
                  <div className="mx-[8px] h-[14px] rounded-[4px] border-2 border-[#8B6914] shadow-[0_4px_0_0_#6B4F0A]"
                    style={{ background: "linear-gradient(to bottom, #D4A83A, #B8860B)" }}
                  />
                  {/* Shelf supports */}
                  <div className="absolute bottom-0 left-[10%] w-[6px] h-[10px] bg-[#8B6914]" />
                  <div className="absolute bottom-0 right-[10%] w-[6px] h-[10px] bg-[#8B6914]" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── The Clorb Noticeboard ───────────────────────────────────────── */}
      {activeTab === "noticeboard" && (
        <div className="flex-1 overflow-y-auto px-[16px] py-[12px]">
          <p className="font-['Work_Sans:Medium',sans-serif] text-[12px] text-black/60 text-center mb-[12px] leading-[1.5]">
            Post your tasks. Claim a bounty. Trade your junk for real-world loot.
          </p>
          <div className="flex flex-col gap-[10px]">
            {bounties.map((bounty) => (
              <motion.div
                key={bounty.id}
                className="bg-white border-2 border-black rounded-[16px] p-[14px] shadow-[2px_2px_0_0_#000]"
                animate={bounty.claimed ? { opacity: 0.6 } : { opacity: 1 }}
              >
                <div className="flex items-start gap-[10px]">
                  <span className="text-[26px] shrink-0">{bounty.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[13px] text-black leading-[1.3] mb-[3px]">
                      {bounty.name}
                      {bounty.claimed && (
                        <span className="ml-[6px] text-[10px] font-['Work_Sans:Regular',sans-serif] text-black/50">
                          (claimed)
                        </span>
                      )}
                    </p>
                    <p className="font-['Work_Sans:Regular',sans-serif] text-[11px] text-black/60 leading-[1.4] mb-[4px]">
                      🧪 {bounty.recipe}
                    </p>
                    <p className="font-['Work_Sans:Medium',sans-serif] text-[11px] text-black leading-[1.4]">
                      🎁 {bounty.reward}
                    </p>
                  </div>
                </div>

                {/* Redeem / Claimed button */}
                <div className="mt-[10px] flex justify-end">
                  <AnimatePresence mode="wait">
                    {bounty.claimed ? (
                      <motion.div
                        key="claimed"
                        className="bg-black/10 border border-black/20 rounded-[10px] px-[14px] py-[6px]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] text-black/50">
                          Claimed ✓
                        </p>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="redeem"
                        onClick={() => handleClaim(bounty.id)}
                        className="bg-[#fff85a] border-2 border-black rounded-[10px] px-[14px] py-[6px] cursor-pointer shadow-[2px_2px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] transition-all"
                        whileTap={{ scale: 0.93 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[12px] text-black">
                          Redeem
                        </p>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Start another task CTA */}
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
