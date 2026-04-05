import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getCollectedItems, CollectedItem } from "../hooks/useGameState";
import { COLLECTIBLE_ASSETS } from "../constants/taskConfig";
import { TopNav } from "../components/TopNav";

// ─── Rarity sort order ───────────────────────────────────────────────────────
const rarityOrder: Record<string, number> = {
  legendary: 0, rare: 1, uncommon: 2, common: 3,
};

// ─── Hand-drawn shelf SVG (black & white, sketch style) ──────────────────────
function ShelfPlank({ variant = 0 }: { variant?: number }) {
  // Three baked-in variants — slightly different top-edge wobble per row
  const topEdges = [
    "M0,5 Q45,2 90,6 Q135,9 180,4 Q225,1 270,6 Q315,9 358,4",
    "M0,4 Q50,7 100,3 Q150,0 200,5 Q245,8 290,3 Q330,1 360,5",
    "M0,6 Q40,3 85,7 Q130,10 175,5 Q220,2 265,7 Q310,10 360,4",
  ];
  const botEdges = [
    "M0,17 Q60,15 120,17 Q180,19 240,17 Q300,15 360,17",
    "M0,18 Q55,16 115,18 Q175,20 235,18 Q295,16 360,18",
    "M0,16 Q65,18 130,16 Q195,14 260,16 Q315,18 360,16",
  ];
  const top = topEdges[variant % topEdges.length];
  const bot = botEdges[variant % botEdges.length];

  return (
    <div style={{ margin: "0 8px", lineHeight: 0 }}>
      <svg
        width="100%"
        viewBox="0 0 360 22"
        preserveAspectRatio="none"
        style={{ display: "block", height: 22 }}
      >
        {/* Plank fill — white */}
        <path d={`${top} L360,20 L0,20 Z`} fill="white" />
        {/* Top sketchy stroke */}
        <path d={top} fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom sketchy stroke */}
        <path d={bot} fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        {/* Grain lines — black, very faint */}
        <line x1="80"  y1="8" x2="80"  y2="18" stroke="black" strokeWidth="0.6" opacity="0.15" />
        <line x1="160" y1="7" x2="160" y2="18" stroke="black" strokeWidth="0.6" opacity="0.12" />
        <line x1="240" y1="8" x2="240" y2="18" stroke="black" strokeWidth="0.6" opacity="0.15" />
        <line x1="320" y1="7" x2="320" y2="18" stroke="black" strokeWidth="0.6" opacity="0.12" />
      </svg>
    </div>
  );
}

// ─── Bounty requirements ──────────────────────────────────────────────────────
interface Requirement {
  itemName: string; // must match CollectedItem.name exactly
  count: number;
}

interface Bounty {
  id: string;
  name: string;
  requirements: Requirement[];
  reward: string;
  emoji: string;
  claimed: boolean;
}

const INITIAL_BOUNTIES: Omit<Bounty, "claimed">[] = [
  {
    id: "mise",
    name: "The Mise en Place Bundle",
    requirements: [
      { itemName: "A single piece of dry macaroni", count: 3 },
      { itemName: "A slightly damp sponge",         count: 1 },
    ],
    reward: "15% discount at a specialty spice retailer",
    emoji: "🧂",
  },
  {
    id: "design",
    name: "The Design Sprint Survivor",
    requirements: [
      { itemName: "A used sticky note",  count: 3 },
      { itemName: "An empty coffee cup", count: 1 },
    ],
    reward: "$5 credit for a digital asset store (fonts, UI kits...)",
    emoji: "🎨",
  },
  {
    id: "polyglot",
    name: "The Polyglot Pack",
    requirements: [
      { itemName: "A crumpled flashcard", count: 4 },
      { itemName: "A stale baguette",     count: 1 },
    ],
    reward: "1-month premium language learning subscription",
    emoji: "🗣️",
  },
  {
    id: "commuter",
    name: "The Commuter's Relief",
    requirements: [
      { itemName: "An expired parking ticket", count: 2 },
      { itemName: "A mysterious lost key",     count: 1 },
    ],
    reward: "Free premium car wash coupon",
    emoji: "🚗",
  },
  {
    id: "laundry",
    name: "The Laundry Day Haul",
    requirements: [
      { itemName: "Holey Socks (single)",  count: 5 },
      { itemName: "A vintage bottlecap",   count: 1 },
    ],
    reward: "$2 Amazon coupon for laundry detergent",
    emoji: "🧺",
  },
  {
    id: "datenight",
    name: "The Date Night Stash",
    requirements: [
      { itemName: "The Ultimate Argyle Sock", count: 2 },
      { itemName: "Melted Chocolate Bar",     count: 1 },
    ],
    reward: "Buy-One-Get-One AMC movie ticket voucher",
    emoji: "🎬",
  },
];

// Count how many of each item name the player has
function buildInventory(collected: CollectedItem[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of collected) {
    map.set(item.name, (map.get(item.name) ?? 0) + 1);
  }
  return map;
}

// Returns { met: boolean, unmet: { itemName, need, have }[] }
function checkRequirements(
  reqs: Requirement[],
  inventory: Map<string, number>
) {
  const unmet: { itemName: string; need: number; have: number }[] = [];
  for (const req of reqs) {
    const have = inventory.get(req.itemName) ?? 0;
    if (have < req.count) unmet.push({ itemName: req.itemName, need: req.count, have });
  }
  return { met: unmet.length === 0, unmet };
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Shelf() {
  const navigate = useNavigate();
  const [items,     setItems]     = useState<CollectedItem[]>([]);
  const [activeTab, setActiveTab] = useState<"shelf" | "rewards">("shelf");
  const [newestId,  setNewestId]  = useState<string | null>(null);
  const [inventory, setInventory] = useState<Map<string, number>>(new Map());
  const [bounties,  setBounties]  = useState<Bounty[]>(() =>
    INITIAL_BOUNTIES.map((b) => ({ ...b, claimed: false }))
  );

  useEffect(() => {
    const collected = getCollectedItems();
    const sorted = [...collected].sort(
      (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity] || b.collectedAt - a.collectedAt
    );
    setItems(sorted);
    setInventory(buildInventory(collected));
    if (sorted.length > 0) {
      const latest = sorted.reduce((a, b) => (a.collectedAt > b.collectedAt ? a : b));
      setNewestId(latest.id);
    }
  }, []);

  const handleClaim = (bountyId: string) => {
    setBounties((prev) => prev.map((b) => (b.id === bountyId ? { ...b, claimed: true } : b)));
  };

  const shelfRows = chunkArray(items, 3);

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden flex flex-col">
      {/* Top nav — identical to Clorbhouse */}
      <TopNav active="collections" />

      {/* Header — sits below nav */}
      <div className="pt-[72px] px-[20px] pb-[10px] shrink-0">
        <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 22, color: "black" }}>
          Clorb's Collections
        </p>
        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
          {items.length} item{items.length !== 1 ? "s" : ""} collected
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-black shrink-0">
        {(["shelf", "rewards"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-[10px] text-center cursor-pointer transition-colors"
            style={{
              fontFamily: "'Work Sans', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              backgroundColor: activeTab === tab ? "#beff6c" : "transparent",
            }}
          >
            {tab === "shelf" ? "🗄️ My Shelf" : "🎁 Rewards"}
          </button>
        ))}
      </div>

      {/* ── My Shelf ─────────────────────────────────────────────────────── */}
      {activeTab === "shelf" && (
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-[16px] pb-[60px] px-[24px]">
              <p style={{ fontFamily: "'Kodchasan', sans-serif", fontWeight: 700, fontSize: 22, color: "black", textAlign: "center" }}>
                Your shelf awaits.
              </p>
              <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 14, color: "rgba(0,0,0,0.6)", textAlign: "center", maxWidth: 260 }}>
                Complete tasks to collect absurd items. They're yours forever. Probably useless. Definitely precious.
              </p>
              <button
                onClick={() => navigate("/todo")}
                className="mt-[8px] cursor-pointer"
                style={{ backgroundColor: "black", color: "white", fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 14, padding: "12px 28px", borderRadius: 20, border: "none" }}
              >
                Start a Task
              </button>
            </div>
          ) : (
            <div className="pb-[24px]">
              {shelfRows.map((row, rowIdx) => (
                <div key={rowIdx} className="relative">
                  {/* Items on the shelf */}
                  <div className="flex justify-around items-end px-[16px] pt-[20px] pb-[4px]">
                    {row.map((item) => {
                      const isNew = item.id === newestId;
                      const assetSrc = COLLECTIBLE_ASSETS[item.name];

                      return (
                        <motion.div
                          key={item.id}
                          className="flex flex-col items-center gap-[6px]"
                          style={{ width: "30%" }}
                          initial={isNew ? { scale: 0.4, opacity: 0, y: -30 } : false}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          transition={isNew ? { type: "spring", damping: 10, stiffness: 200, delay: 0.1 } : {}}
                        >
                          {/* B&W sketch box */}
                          <div
                            style={{
                              width: 72,
                              height: 72,
                              backgroundColor: "white",
                              border: "2.5px solid black",
                              borderRadius: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            {assetSrc ? (
                              <img
                                src={assetSrc}
                                alt={item.name}
                                style={{ width: 52, height: 52, objectFit: "contain" }}
                              />
                            ) : (
                              <span style={{ fontSize: 32 }}>{item.emoji}</span>
                            )}
                          </div>
                          <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 9, textAlign: "center", lineHeight: "12px", color: "black", maxWidth: 72 }}>
                            {item.name}
                          </p>
                        </motion.div>
                      );
                    })}

                    {/* Fill empty slots */}
                    {row.length < 3 &&
                      Array.from({ length: 3 - row.length }).map((_, i) => (
                        <div key={`empty-${i}`} style={{ width: "30%" }} />
                      ))}
                  </div>

                  {/* Hand-drawn shelf plank */}
                  <ShelfPlank variant={rowIdx} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── The Clorb Rewards ─────────────────────────────────────────── */}
      {activeTab === "rewards" && (
        <div className="flex-1 overflow-y-auto px-[16px] py-[12px]">
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.5)", textAlign: "center", marginBottom: 12, lineHeight: 1.5 }}>
            Collect items, meet the requirements, redeem real-world rewards.
          </p>
          <div className="flex flex-col gap-[10px]">
            {bounties.map((bounty) => {
              const { met, unmet } = checkRequirements(bounty.requirements, inventory);

              return (
                <motion.div
                  key={bounty.id}
                  className="bg-white border-2 border-black rounded-[16px] p-[14px] shadow-[2px_2px_0_0_#000]"
                  animate={bounty.claimed ? { opacity: 0.6 } : { opacity: 1 }}
                >
                  <div className="flex items-start gap-[10px]">
                    <span style={{ fontSize: 26, flexShrink: 0 }}>{bounty.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "black", lineHeight: 1.3, marginBottom: 3 }}>
                        {bounty.name}
                        {bounty.claimed && (
                          <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 400, color: "rgba(0,0,0,0.5)" }}>
                            (claimed)
                          </span>
                        )}
                      </p>
                      {/* Requirements list */}
                      <div style={{ marginBottom: 4 }}>
                        {bounty.requirements.map((req) => {
                          const have = inventory.get(req.itemName) ?? 0;
                          const satisfied = have >= req.count;
                          return (
                            <p key={req.itemName} style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: satisfied ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.85)", lineHeight: 1.5 }}>
                              {satisfied ? "✓" : "○"} {req.count}× {req.itemName}
                              {!satisfied && !bounty.claimed && (
                                <span style={{ color: "#cc4444", marginLeft: 4 }}>
                                  (have {have})
                                </span>
                              )}
                            </p>
                          );
                        })}
                      </div>
                      <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: "black", lineHeight: 1.4 }}>
                        🎁 {bounty.reward}
                      </p>
                    </div>
                  </div>

                  {/* Redeem / Locked / Claimed */}
                  <div className="mt-[10px] flex justify-end">
                    <AnimatePresence mode="wait">
                      {bounty.claimed ? (
                        <motion.div
                          key="claimed"
                          style={{ backgroundColor: "rgba(0,0,0,0.1)", border: "1px solid rgba(0,0,0,0.2)", borderRadius: 10, padding: "6px 14px" }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                            Claimed ✓
                          </p>
                        </motion.div>
                      ) : met ? (
                        <motion.button
                          key="redeem"
                          onClick={() => handleClaim(bounty.id)}
                          style={{ backgroundColor: "#fff85a", border: "2px solid black", borderRadius: 10, padding: "6px 14px", cursor: "pointer", boxShadow: "2px 2px 0 0 #000", fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 12, color: "black" }}
                          whileTap={{ scale: 0.93 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Redeem
                        </motion.button>
                      ) : (
                        <motion.div
                          key="locked"
                          style={{ backgroundColor: "rgba(0,0,0,0.05)", border: "1.5px solid rgba(0,0,0,0.2)", borderRadius: 10, padding: "6px 14px" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 11, color: "rgba(0,0,0,0.4)" }}>
                            🔒 Need{" "}
                            {unmet.map((u, i) => (
                              <span key={u.itemName}>
                                {Math.max(0, (u.need ?? 0) - (u.have ?? 0))} more {u.itemName.toLowerCase()}
                                {i < unmet.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Start another task CTA */}
      {activeTab === "shelf" && items.length > 0 && (
        <div className="px-[16px] py-[12px] border-t-2 border-black shrink-0 bg-[#fefdf8]">
          <button
            onClick={() => navigate("/todo")}
            style={{ width: "100%", backgroundColor: "black", color: "white", fontFamily: "'Work Sans', sans-serif", fontWeight: 600, fontSize: 15, padding: "14px 0", borderRadius: 20, border: "none", cursor: "pointer" }}
          >
            Start Another Task
          </button>
        </div>
      )}
    </div>
  );
}
