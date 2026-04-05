// ─── Task Taglines ────────────────────────────────────────────────────────────
// Funny subtitle shown under each task name in the task menu.
// Edit these freely — no component code needs changing.
export const TASK_TAGLINES: Record<string, string> = {
  laundry: "the pile has achieved sentience.",
  dishes: "they've been 'soaking' for three days.",
  tidying: "just shove it under the bed. wait, no.",
  cooking: "delivery doesn't count. (it counts.)",
  working: "the emails are breeding in the dark.",
  studying: "highlighting IS the same as knowing it.",
  errands: "the outside world has been asking about you.",
};

// ─── Task Icons ────────────────────────────────────────────────────────────────
// Maps task IDs to icon asset paths from /src/assets/icons/.
// Drop a new icon file in that folder and add a line here.
import laundryIcon from "@/assets/icons/laundry_icon.png";
import dishesIcon from "@/assets/icons/dishes_icon.png";
import sweepIcon from "@/assets/icons/sweep_icon.png";
import miscIcon from "@/assets/icons/miscellaneous_icon.png";
import emailIcon from "@/assets/icons/email_icon.png";
import listIcon from "@/assets/icons/list_icon.png";
import trashIcon from "@/assets/icons/trash_icon.png";

export const TASK_ICONS: Record<string, string> = {
  laundry: laundryIcon,
  dishes: dishesIcon,
  tidying: sweepIcon,
  cooking: miscIcon,
  working: emailIcon,
  studying: listIcon,
  errands: trashIcon,
};

// ─── Task Animations (clorb_animations folder) ────────────────────────────────
// Maps task IDs to GIF/image asset paths. Used to show the right animation
// for each clorb in the execution room. null = use static clorb image.
import laundryAnim from "@/assets/clorb_animations/doing-laundry.GIF";
import dishesAnim from "@/assets/clorb_animations/washing-dishes.GIF";
import dryingAnim from "@/assets/clorb_animations/drying-dishes.GIF";
import tidyAnim from "@/assets/clorb_animations/cleaning-table.GIF";
import trashAnim from "@/assets/clorb_animations/taking-out-trash.GIF";

export const TASK_ANIMATIONS: Record<string, string | null> = {
  laundry: laundryAnim,
  dishes: dishesAnim,
  tidying: tidyAnim,
  cooking: null,
  working: null,
  studying: null,
  errands: trashAnim,
};

// ─── Collectible Asset Mapping ─────────────────────────────────────────────────
// Maps reward names (as stored in game state) to collectible image assets.
// Add entries here when new collectibles are introduced.
import sockAsset from "@/assets/collectibles/sock.png";
import ratAsset from "@/assets/collectibles/rat.png";
import shoeAsset from "@/assets/collectibles/shoe.png";
import handAsset from "@/assets/collectibles/hand.png";
import eyeAsset from "@/assets/collectibles/eye.png";
import cheeseAsset from "@/assets/collectibles/cheese.png";
import meatAsset from "@/assets/collectibles/meat.png";
import soupAsset from "@/assets/collectibles/soup.png";
import spoonAsset from "@/assets/collectibles/spoon.png";

export const COLLECTIBLE_ASSETS: Record<string, string> = {
  "A single piece of dry macaroni": soupAsset,
  "A slightly damp sponge": eyeAsset,
  "A crumpled flashcard": handAsset,
  "An expired parking ticket": shoeAsset,
  "World's Okayest Clorb Mug": cheeseAsset,
  "A receipt from 2018": spoonAsset,
  "A used sticky note": meatAsset,
  "Holey Socks (single)": sockAsset,
  "Tax Form Hat": ratAsset,
  "A mysterious lost key": handAsset,
  "A stale baguette": meatAsset,
  "An empty coffee cup": soupAsset,
  "The Ultimate Argyle Sock": sockAsset,
  "A vintage bottlecap": cheeseAsset,
  "Melted Chocolate Bar": meatAsset,
};

// ─── Room Clorb Speech Lines ────────────────────────────────────────────────────
// Random lines shown in speech bubbles when hovering a clorb in the room.
export const CLORB_SPEECH_LINES = [
  "Just got 3 dishes done!",
  "On my second load of laundry 💪",
  "I vacuumed UNDER the couch.",
  "The inbox is at 12. Was at 400.",
  "Been at it for 47 minutes. I'm fine.",
  "My floor is VISIBLE.",
  "I can see the sink again.",
  "This is my fourth chore this week.",
  "I made my bed AND fluffed the pillows.",
  "Studied for 30 mins. Highlight queen.",
  "We do NOT look at the bathroom.",
  "Cooking real food tonight. Maybe.",
  "The laundry pile is defeated.",
  "One more errand and I'm done.",
  "Just swept and it felt GREAT.",
];
