import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import imgUntitled500X500Px61 from "../../imports/IPhone161/749af56786e9c6161adfcf899904dec36b1941a5.png";
import { recordCompletion } from "../hooks/useGameState";
import { COLLECTIBLE_ASSETS } from "../constants/taskConfig";
import { supabase } from "../../lib/supabase";

// TODO: Swap the 🎁 placeholder below with presentBox once the asset is added:
// import presentBox from "@/assets/present_box.png";

type Rarity = "common" | "uncommon" | "rare" | "legendary";

interface Reward {
  name: string;
  rarity: Rarity;
  emoji: string;
  description: string;
}

const rewards: Reward[] = [
  { name: "A single piece of dry macaroni", rarity: "common", emoji: "🍝", description: "Just one. Perfectly al-dente-dry." },
  { name: "A slightly damp sponge", rarity: "common", emoji: "🧽", description: "It leaves a small water puddle under it." },
  { name: "Lukewarm soup", rarity: "common", emoji: "📇", description: "The answer is on the other side. Always." },
  { name: "An expired parking ticket", rarity: "common", emoji: "🎫", description: "From a street that no longer exists." },
  { name: "Participation award", rarity: "uncommon", emoji: "☕", description: "You're not great. You're okay." },
  { name: "A receipt from 2018", rarity: "uncommon", emoji: "🧾", description: "Faded text. Oddly long. What did you buy?" },
  { name: "A used sticky note", rarity: "uncommon", emoji: "📝", description: "It still has a tiny bit of stick left." },
  { name: "A single sock", rarity: "uncommon", emoji: "🧦", description: "One sock. Multiple holes. Infinite character." },
  { name: "A soggy tea bag", rarity: "rare", emoji: "🎩", description: "A 1040 form folded into a paper boat hat." },
  { name: "A button from a shirt you don't own", rarity: "rare", emoji: "🗝️", description: "Opens something, somewhere, probably." },
  { name: "A stale baguette", rarity: "rare", emoji: "🥖", description: "Weapon-grade density. Still somehow delicious." },
  { name: "A half-baked pizza pocket", rarity: "rare", emoji: "🫗", description: "Still radiates the ghost of caffeine." },
  { name: "A loose rubber band", rarity: "legendary", emoji: "🧦", description: "A single, unmatched argyle sock. Fashion." },
  { name: "A very nice spoon", rarity: "legendary", emoji: "🪙", description: "Worth exactly one feeling of accomplishment." },
  { name: "A polly pocket shoe", rarity: "legendary", emoji: "🍫", description: "Still edible. Probably. Definitely eat it." },
];

const rarityColors: Record<Rarity, string> = {
  common: "#E8E8E8",
  uncommon: "#6ee86e",
  rare: "#69b4ff",
  legendary: "#FFD700",
};

const rarityWeights: Record<Rarity, number> = {
  common: 0.50,
  uncommon: 0.30,
  rare: 0.15,
  legendary: 0.05,
};

function pickReward(): Reward {
  const rand = Math.random();
  let cumulative = 0;
  for (const [rarity, weight] of Object.entries(rarityWeights) as [Rarity, number][]) {
    cumulative += weight;
    if (rand < cumulative) {
      const pool = rewards.filter((r) => r.rarity === rarity);
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return rewards[0];
}

export default function RewardScreen() {
  const navigate = useNavigate();
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);

  useEffect(() => {
    setReward(pickReward());
  }, []);

  const handleReveal = () => {
    if (!reward) return;
    setIsRevealed(true);

    // Save to localStorage (local guilt system)
    recordCompletion({
      name: reward.name,
      rarity: reward.rarity,
      emoji: reward.emoji,
      description: reward.description,
    });

    // Save to DB shelf_items
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from("shelf_items")
        .insert({ user_id: user.id, item_key: reward.name })
        .then(({ error }) => {
          if (error) console.error("[Reward] shelf_items insert failed:", error.message)
        })
    });

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ["#FFD700", "#FF69B4", "#00CED1", "#9370DB"] });
    setTimeout(() => {
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
    }, 200);
  };

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffa2e3] via-[#7489ff] to-[#49dbc8] opacity-20" />

      {!isRevealed ? (
        <motion.div
          className="relative flex flex-col items-center px-[24px]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-['Kodchasan:Bold',sans-serif] text-[36px] text-black text-center mb-[32px] tracking-[-0.72px]">
            You did it!<br />Time for your reward!
          </p>

          <motion.div
            className="relative w-[220px] h-[220px] cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReveal}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-[24px] border-4 border-black shadow-[8px_8px_0_0_#000]" />
            <div className="absolute inset-[10px] bg-gradient-to-br from-[#FFE55C] to-[#FFD700] rounded-[20px] flex items-center justify-center">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="text-[72px]"
              >
                🎁
              </motion.div>
            </div>
            <motion.div
              className="absolute -top-[10px] -right-[10px] bg-[#FF69B4] rounded-full size-[40px] border-2 border-black flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-[18px]">✨</span>
            </motion.div>
          </motion.div>

          <p className="font-['Work_Sans:Medium',sans-serif] text-[18px] text-black text-center mt-[24px]">
            Tap to open!
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="relative flex flex-col items-center px-[24px] w-full"
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <p className="font-['Kodchasan:Bold',sans-serif] text-[28px] text-black text-center mb-[16px] tracking-[-0.56px]">
            You received:
          </p>

          {reward && (
            <>
              <motion.div
                className="relative w-[280px] min-h-[280px] rounded-[24px] border-4 border-black shadow-[8px_8px_0_0_#000] p-[24px] flex flex-col items-center justify-center"
                style={{ backgroundColor: rarityColors[reward.rarity] }}
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="absolute top-[12px] right-[12px] bg-black text-white px-[10px] py-[4px] rounded-[10px] text-[10px] font-['Work_Sans:Bold',sans-serif] font-bold uppercase tracking-wider">
                  {reward.rarity}
                </div>

                {COLLECTIBLE_ASSETS[reward.name] ? (
                  <img
                    src={COLLECTIBLE_ASSETS[reward.name]}
                    alt={reward.name}
                    className="w-[100px] h-[100px] object-contain mb-[12px] drop-shadow-lg"
                  />
                ) : (
                  <div className="text-[88px] mb-[12px]">{reward.emoji}</div>
                )}

                <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[18px] text-black text-center mb-[8px]">
                  {reward.name}
                </p>

                <p className="font-['Work_Sans:Regular',sans-serif] text-[13px] text-black text-center opacity-80">
                  {reward.description}
                </p>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-col gap-[10px] mt-[24px] w-full max-w-[280px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  onClick={() => navigate("/shelf")}
                  className="bg-[#FFD700] border-2 border-black rounded-[16px] py-[14px] w-full cursor-pointer hover:shadow-[4px_4px_0_0_#000] transition-all shadow-[2px_2px_0_0_#000]"
                >
                  <p className="font-['Work_Sans:SemiBold',sans-serif] font-semibold text-[15px] text-black text-center">
                    View My Shelf ✨
                  </p>
                </button>

                <button
                  onClick={() => navigate("/todo")}
                  className="bg-black rounded-[16px] py-[14px] w-full cursor-pointer hover:bg-[#333] transition-colors"
                >
                  <p className="font-['Work_Sans:Medium',sans-serif] font-medium text-[15px] text-white text-center">
                    Back to tasks
                  </p>
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      )}

      {/* Floating Clorb */}
      <motion.div
        className="absolute bottom-[80px] right-[32px] size-[72px]"
        animate={{ y: [0, -12, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img alt="Clorb celebrating" src={imgUntitled500X500Px61} className="w-full h-full object-contain" />
      </motion.div>
    </div>
  );
}
