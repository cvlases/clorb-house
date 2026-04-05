import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { COLLECTIBLE_ASSETS } from "../constants/taskConfig";
import { TopNav } from "../components/TopNav";
import { supabase } from "../../lib/supabase";
import { REWARDS, CHORE_LABELS } from "../../config/rewards";

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

// ─── Shelf item (from DB) ─────────────────────────────────────────────────────
interface ShelfItem {
  id: string;
  item_key: string;
  earned_at: string;
}

// Returns { met, needed } for a single reward vs chore session counts
function checkReward(
  requiresChoreType: string,
  requiresCount: number,
  choreCounts: Record<string, number>
) {
  const have   = choreCounts[requiresChoreType] ?? 0;
  const needed = Math.max(0, (requiresCount ?? 0) - (have ?? 0));
  return { met: needed === 0, needed, have }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function Shelf() {
  const navigate = useNavigate();
  const [items,       setItems]       = useState<ShelfItem[]>([]);
  const [activeTab,   setActiveTab]   = useState<"shelf" | "rewards">("shelf");
  const [newestId,    setNewestId]    = useState<string | null>(null);
  const [choreCounts, setChoreCounts] = useState<Record<string, number>>({});
  const [redeemedIds, setRedeemedIds] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingData(false); return; }

      // Load shelf items (collectibles — item_key is a collectible name)
      const { data: shelfData } = await supabase
        .from("shelf_items")
        .select("id, item_key, earned_at")
        .eq("user_id", user.id)
        .order("earned_at", { ascending: false });

      const collectibles = (shelfData ?? []).filter(
        (item: ShelfItem) => COLLECTIBLE_ASSETS[item.item_key] !== undefined
      );
      setItems(collectibles);
      if (collectibles.length > 0) setNewestId(collectibles[0].id);

      // Track which reward ids have been redeemed (item_key = reward id)
      const rewardIds = new Set<string>(
        (shelfData ?? [])
          .filter((item: ShelfItem) => REWARDS.some((r) => r.id === item.item_key))
          .map((item: ShelfItem) => item.item_key)
      );
      setRedeemedIds(rewardIds);

      // Count completed chore sessions per type
      const { data: sessions } = await supabase
        .from("chore_sessions")
        .select("chore_type")
        .eq("user_id", user.id)
        .eq("status", "completed");

      const counts: Record<string, number> = {};
      for (const s of sessions ?? []) {
        counts[s.chore_type] = (counts[s.chore_type] ?? 0) + 1;
      }
      setChoreCounts(counts);
      setLoadingData(false);
    }
    load();
  }, []);

  const handleRedeem = async (rewardId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("shelf_items").insert({ user_id: user.id, item_key: rewardId });
    setRedeemedIds((prev) => new Set([...prev, rewardId]));
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
          {loadingData ? "…" : `${items.length} item${items.length !== 1 ? "s" : ""} collected`}
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
                      const assetSrc = COLLECTIBLE_ASSETS[item.item_key];

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
                            {item.item_key}
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

      {/* ── Rewards ──────────────────────────────────────────────────────── */}
      {activeTab === "rewards" && (
        <div className="flex-1 overflow-y-auto px-[16px] py-[12px]">
          <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 12, color: "rgba(0,0,0,0.5)", textAlign: "center", marginBottom: 12, lineHeight: 1.5 }}>
            Complete chores, meet the requirements, redeem real-world rewards.
          </p>
          {loadingData ? (
            <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13, textAlign: "center", color: "rgba(0,0,0,0.4)", marginTop: 32 }}>
              Loading...
            </p>
          ) : (
            <div className="flex flex-col gap-[10px]">
              {REWARDS.map((reward) => {
                const { met, needed, have } = checkReward(reward.requiresChoreType, reward.requiresCount, choreCounts);
                const claimed = redeemedIds.has(reward.id);
                const choreLabel = CHORE_LABELS[reward.requiresChoreType] ?? reward.requiresChoreType;

                return (
                  <motion.div
                    key={reward.id}
                    className="bg-white border-2 border-black rounded-[16px] p-[14px] shadow-[2px_2px_0_0_#000]"
                    animate={claimed ? { opacity: 0.6 } : { opacity: 1 }}
                  >
                    <div className="flex items-start gap-[10px]">
                      <span style={{ fontSize: 26, flexShrink: 0 }}>{reward.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 700, fontSize: 13, color: "black", lineHeight: 1.3, marginBottom: 3 }}>
                          {reward.name}
                          {claimed && (
                            <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 400, color: "rgba(0,0,0,0.5)" }}>
                              (claimed)
                            </span>
                          )}
                        </p>
                        {/* Requirement row */}
                        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: met ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.85)", lineHeight: 1.5, marginBottom: 4 }}>
                          {met ? "✓" : "○"} {reward.requiresCount}× {choreLabel} completed
                          {!met && !claimed && (
                            <span style={{ color: "#cc4444", marginLeft: 4 }}>({have}/{reward.requiresCount})</span>
                          )}
                        </p>
                        <p style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 11, color: "black", lineHeight: 1.4 }}>
                          🎁 {reward.reward}
                        </p>
                      </div>
                    </div>

                    {/* Redeem / Locked / Claimed */}
                    <div className="mt-[10px] flex justify-end">
                      <AnimatePresence mode="wait">
                        {claimed ? (
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
                            onClick={() => handleRedeem(reward.id)}
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
                              🔒 {needed} more {choreLabel}{needed !== 1 ? "s" : ""} needed
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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
