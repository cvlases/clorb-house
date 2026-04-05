import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import imgUntitled500X500Px61 from "../../imports/IPhone161/749af56786e9c6161adfcf899904dec36b1941a5.png";

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
  { name: "World's Okayest Clorb Mug", rarity: "uncommon", emoji: "☕", description: "You're not great. You're okay." },
  { name: "A receipt from 2018", rarity: "uncommon", emoji: "🧾", description: "Faded text. Oddly long. What did you buy?" },
  { name: "Tax Form Hat", rarity: "rare", emoji: "🎩", description: "A 1040 form folded into a paper boat hat." },
  { name: "The Ultimate Sock", rarity: "legendary", emoji: "🧦", description: "A single, unmatched, argyle sock." },
];

const rarityColors: Record<Rarity, string> = {
  common: "#D3D3D3",
  uncommon: "#4CAF50",
  rare: "#2196F3",
  legendary: "#FFD700",
};

export default function Reward() {
  const navigate = useNavigate();
  const [isRevealed, setIsRevealed] = useState(false);
  const [reward, setReward] = useState<Reward | null>(null);

  useEffect(() => {
    // Determine reward based on weighted rarity
    const rand = Math.random();
    let selectedReward: Reward;

    if (rand < 0.5) {
      // 50% common
      selectedReward = rewards.filter(r => r.rarity === "common")[Math.floor(Math.random() * 2)];
    } else if (rand < 0.8) {
      // 30% uncommon
      selectedReward = rewards.filter(r => r.rarity === "uncommon")[Math.floor(Math.random() * 2)];
    } else if (rand < 0.95) {
      // 15% rare
      selectedReward = rewards.find(r => r.rarity === "rare")!;
    } else {
      // 5% legendary
      selectedReward = rewards.find(r => r.rarity === "legendary")!;
    }

    setReward(selectedReward);
  }, []);

  const handleReveal = () => {
    setIsRevealed(true);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FFD700", "#FF69B4", "#00CED1", "#9370DB"],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 200);
  };

  return (
    <div className="bg-[#fefdf8] relative size-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffa2e3] via-[#7489ff] to-[#49dbc8] opacity-20" />

      {!isRevealed ? (
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-['Kodchasan:Bold',sans-serif] text-[36px] text-black text-center mb-[40px] tracking-[-0.72px]">
            You did it!<br />Time for your reward!
          </p>

          <motion.div
            className="relative w-[250px] h-[250px] cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReveal}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-[24px] border-4 border-black shadow-[8px_8px_0_0_#000]" />
            <div className="absolute inset-[10px] bg-gradient-to-br from-[#FFE55C] to-[#FFD700] rounded-[20px] flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-[80px]"
              >
                🎁
              </motion.div>
            </div>
            <motion.div
              className="absolute -top-[10px] -right-[10px] bg-[#FF69B4] rounded-full size-[40px] border-2 border-black flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <span className="text-[20px]">✨</span>
            </motion.div>
          </motion.div>

          <p className="font-['Work_Sans:Medium',sans-serif] text-[18px] text-black text-center mt-[30px]">
            Tap to open!
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <p className="font-['Kodchasan:Bold',sans-serif] text-[28px] text-black text-center mb-[20px] tracking-[-0.56px]">
            You received:
          </p>

          {reward && (
            <>
              <motion.div
                className="relative w-[280px] min-h-[320px] rounded-[24px] border-4 border-black shadow-[8px_8px_0_0_#000] p-[24px] flex flex-col items-center justify-center"
                style={{ backgroundColor: rarityColors[reward.rarity] }}
                initial={{ rotateY: 180 }}
                animate={{ rotateY: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="absolute top-[12px] right-[12px] bg-black text-white px-[12px] py-[4px] rounded-[12px] text-[10px] font-['Work_Sans:Bold',sans-serif] font-bold uppercase">
                  {reward.rarity}
                </div>

                <div className="text-[100px] mb-[16px]">{reward.emoji}</div>
                
                <p className="font-['Work_Sans:Bold',sans-serif] font-bold text-[20px] text-black text-center mb-[12px]">
                  {reward.name}
                </p>
                
                <p className="font-['Work_Sans:Regular',sans-serif] text-[14px] text-black text-center opacity-80">
                  {reward.description}
                </p>
              </motion.div>

              <motion.button
                onClick={() => navigate("/todo")}
                className="bg-black content-stretch flex gap-[12px] items-center justify-center px-[77px] py-[14px] rounded-[24px] mt-[40px] w-[335px] cursor-pointer hover:bg-[#333] transition-colors"
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <p className="font-['Work_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
                  Back to tasks
                </p>
              </motion.button>
            </>
          )}
        </motion.div>
      )}

      {/* Floating Clorb */}
      <motion.div
        className="absolute bottom-[80px] right-[40px] size-[80px]"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img alt="Clorb celebrating" src={imgUntitled500X500Px61} className="w-full h-full object-contain" />
      </motion.div>
    </div>
  );
}
