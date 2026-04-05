// ─── Task Taglines ────────────────────────────────────────────────────────────
export const TASK_TAGLINES: Record<string, string> = {
  laundry:  "the pile has achieved sentience.",
  dishes:   "they've been 'soaking' for three days.",
  tidying:  "just shove it under the bed. wait, no.",
  cooking:  "delivery doesn't count. (it counts.)",
  working:  "the emails are breeding in the dark.",
  studying: "highlighting IS the same as knowing it.",
  errands:  "the outside world has been asking about you.",
};

// ─── Task Icons ────────────────────────────────────────────────────────────────
import laundryIcon  from "@/assets/icons/laundry_icon.png";
import dishesIcon   from "@/assets/icons/dishes_icon.png";
import sweepIcon    from "@/assets/icons/sweep_icon.png";
import miscIcon     from "@/assets/icons/miscellaneous_icon.png";
import emailIcon    from "@/assets/icons/email_icon.png";
import listIcon     from "@/assets/icons/list_icon.png";
import trashIcon    from "@/assets/icons/trash_icon.png";

export const TASK_ICONS: Record<string, string> = {
  laundry:  laundryIcon,
  dishes:   dishesIcon,
  tidying:  sweepIcon,
  cooking:  miscIcon,
  working:  emailIcon,
  studying: listIcon,
  errands:  trashIcon,
};

// ─── Task Animations ─────────────────────────────────────────────────────────
import laundryAnim from "@/assets/clorb_animations/doing-laundry.GIF";
import dishesAnim  from "@/assets/clorb_animations/washing-dishes.GIF";
import dryingAnim  from "@/assets/clorb_animations/drying-dishes.GIF";
import tidyAnim    from "@/assets/clorb_animations/cleaning-table.GIF";
import trashAnim   from "@/assets/clorb_animations/taking-out-trash.GIF";

export const TASK_ANIMATIONS: Record<string, string | null> = {
  laundry:  laundryAnim,
  dishes:   dishesAnim,
  tidying:  tidyAnim,
  cooking:  null,
  working:  null,
  studying: null,
  errands:  trashAnim,
};

// ─── Collectible Asset Mapping ─────────────────────────────────────────────────
import sockAsset   from "@/assets/collectibles/sock.png";
import ratAsset    from "@/assets/collectibles/rat.png";
import shoeAsset   from "@/assets/collectibles/shoe.png";
import handAsset   from "@/assets/collectibles/hand.png";
import eyeAsset    from "@/assets/collectibles/eye.png";
import cheeseAsset from "@/assets/collectibles/cheese.png";
import meatAsset   from "@/assets/collectibles/meat.png";
import soupAsset   from "@/assets/collectibles/soup.png";
import spoonAsset  from "@/assets/collectibles/spoon.png";

export const COLLECTIBLE_ASSETS: Record<string, string> = {
  "A single piece of dry macaroni":  soupAsset,
  "A slightly damp sponge":          eyeAsset,
  "A crumpled flashcard":            handAsset,
  "An expired parking ticket":       shoeAsset,
  "World's Okayest Clorb Mug":       cheeseAsset,
  "A receipt from 2018":             spoonAsset,
  "A used sticky note":              meatAsset,
  "Holey Socks (single)":            sockAsset,
  "Tax Form Hat":                    ratAsset,
  "A mysterious lost key":           handAsset,
  "A stale baguette":                meatAsset,
  "An empty coffee cup":             soupAsset,
  "The Ultimate Argyle Sock":        sockAsset,
  "A vintage bottlecap":             cheeseAsset,
  "Melted Chocolate Bar":            meatAsset,
};

// ─── Speech Bubble Messages ────────────────────────────────────────────────────
// Per-task lines + shared gen-Z pool. 50/50 split when showing a bubble.
// Edit freely here — no component code changes needed.

export const TASK_SPEECH_LINES: Record<string, string[]> = {
  laundry: [
    "finally addressing the situation",
    "the pile had names. had.",
    "third cycle in. still going.",
    "not me sniffing every item first",
    "this sock is from a different era",
    "the dryer is my best friend rn",
  ],
  dishes: [
    "this is my villain origin story",
    "i found a fork from 2019 in here",
    "the bubbles are the only good part ngl",
    "why are there 7 mugs",
    "the sponge has been through it",
    "there is no logical explanation for this pot",
  ],
  tidying: [
    "found three things i thought i lost",
    "the floor EXISTS. i forgot.",
    "shoved half of it in a drawer, moving on",
    "organizing is just shuffling the chaos",
    "this is definitely a pile not a system",
    "vacuumed UNDER the couch. hero behavior.",
  ],
  cooking: [
    "mise en place except i have none",
    "it's... probably edible",
    "gordon ramsay would NOT like this",
    "counting this as a creative project",
    "one pot. that is all. respect.",
    "it smells fine which means it IS fine",
  ],
  working: [
    "the emails are multiplying",
    "one task. just one. that's all.",
    "in the zone. do not disturb.",
    "somehow the inbox grew",
    "this tab has been open for 9 days",
    "focused. mostly. (20% focused.)",
  ],
  studying: [
    "if i highlight it, i know it",
    "on my fourth cup of something",
    "flashcards go brrr",
    "definitely absorbing this information",
    "reread that sentence six times still lost",
    "pomodoro timer said go and i said okay",
  ],
  errands: [
    "the outside world is a lot",
    "found parking in under 10 mins!!!",
    "the list had more items than expected",
    "almost back. almost.",
    "the grocery store was a journey",
    "i did ALL of them. on foot. respect me.",
  ],
};

export const GENERIC_GEN_Z_LINES: string[] = [
  "not me doing the most rn",
  "it's giving responsible adult",
  "i did not consent to adulting today",
  "the audacity of this chore",
  "we're so back",
  "this is giving main character energy",
  "bestie i am DOING IT",
  "no thoughts, just tasks",
  "the task said go and i said okay",
  "living my best domestic life",
  "clorb behavior honestly",
  "unbothered. moisturized. doing chores.",
  "slay then resume",
  "this is the villain arc but productive",
  "doing the most in the best way",
];

// ─── Vigil Copy ────────────────────────────────────────────────────────────────
// Inscriptions on the gravestone and overlay text. Edit here to swap copy.
export const VIGIL_COPY = {
  gravestoneTitle: "RIP",
  gravestoneSubtitle: "this chore",
  overlayTitle: "Clorb Vigil",
  overlayBody: "the task has been abandoned.",
};

/**
 * Returns a speech line for a given clorb task.
 * 50% chance of a task-specific line, 50% generic gen-Z.
 */
export function getSpeechLine(taskId: string): string {
  const useTaskSpecific = Math.random() < 0.5;
  const taskPool = TASK_SPEECH_LINES[taskId];

  if (useTaskSpecific && taskPool && taskPool.length > 0) {
    return taskPool[Math.floor(Math.random() * taskPool.length)];
  }
  return GENERIC_GEN_Z_LINES[Math.floor(Math.random() * GENERIC_GEN_Z_LINES.length)];
}
