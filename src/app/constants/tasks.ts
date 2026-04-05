export const TASKS = [
  {
    id: "laundry",
    name: "Do Laundry",
    actionName: "laundry",
    color: "#49DBC8",
    emoji: "🧺",
    estimatedTime: "5min per 8 pieces",
    clorbCount: 103,
    category: "frequent",
  },
  {
    id: "dishes",
    name: "Clean the Dishes",
    actionName: "doing dishes",
    color: "#FD9FDD",
    emoji: "🍽️",
    estimatedTime: "5-10 minutes",
    clorbCount: 127,
    category: "frequent",
  },
  {
    id: "tidying",
    name: "Tidying Up",
    actionName: "tidying up",
    color: "#FFF172",
    emoji: "🧹",
    estimatedTime: "10-20 minutes",
    clorbCount: 89,
    category: "frequent",
  },
  {
    id: "cooking",
    name: "Cooking",
    actionName: "cooking",
    color: "#FC7339",
    emoji: "🍳",
    estimatedTime: "20-45 minutes",
    clorbCount: 62,
    category: "kitchen",
  },
  {
    id: "working",
    name: "Working",
    actionName: "working",
    color: "#AF96FB",
    emoji: "💻",
    estimatedTime: "25-90 minutes",
    clorbCount: 214,
    category: "frequent",
  },
  {
    id: "studying",
    name: "Studying",
    actionName: "studying",
    color: "#6BC6FF",
    emoji: "📚",
    estimatedTime: "25-60 minutes",
    clorbCount: 156,
    category: "frequent",
  },
  {
    id: "errands",
    name: "Running Errands",
    actionName: "running errands",
    color: "#BEFF6C",
    emoji: "🚗",
    estimatedTime: "15-60 minutes",
    clorbCount: 41,
    category: "frequent",
  },
];

export const TASK_CATEGORIES = ["frequent", "kitchen", "bedroom", "office"] as const;

export const CLORB_MESSAGES = [
  "The digital dishes are clean. Are the real ones? I doubt it.",
  "We're all in this together! Sort of.",
  "Doing great! Or are you? Only you know.",
  "Tasks don't do themselves. Unfortunately.",
  "Clorb believes in you. Probably.",
  "Look at all these Clorbs working! Inspiring, right?",
  "You could give up. But where's the fun in that?",
  "Time flies when you're... doing chores?",
  "Remember: Every journey begins with a single sock.",
  "The void appreciates your effort. Kind of.",
  "You're literally doing it right now. Incredible.",
  "Stay strong. The task cannot hurt you.",
];

export type TaskId = (typeof TASKS)[number]["id"];

export function getTaskById(id: string | undefined) {
  return TASKS.find((task) => task.id === id) || TASKS[0];
}
