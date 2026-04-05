export const TASKS = [
  { 
    id: "laundry", 
    name: "Do Laundry", 
    actionName: "laundry",
    color: "#49DBC8", 
    emoji: "🧺",
    estimatedTime: "5min per 8 pieces",
    clorbCount: 103,
  },
  { 
    id: "make-bed", 
    name: "Make Bed", 
    actionName: "making their bed",
    color: "#FFF172", 
    emoji: "🛏️",
    estimatedTime: "2-3 minutes",
    clorbCount: 28,
  },
  { 
    id: "clean-dishes", 
    name: "Clean Dishes", 
    actionName: "cleaning dishes",
    color: "#FD9FDD", 
    emoji: "🍽️",
    estimatedTime: "5-10 minutes",
    clorbCount: 127,
  },
  { 
    id: "take-out-trash", 
    name: "Take Out Trash", 
    actionName: "taking out trash",
    color: "#AF96FB", 
    emoji: "🗑️",
    estimatedTime: "1-2 minutes",
    clorbCount: 78,
  },
  { 
    id: "clean-floors", 
    name: "Clean Floors", 
    actionName: "cleaning floors",
    color: "#FC7339", 
    emoji: "🧹",
    estimatedTime: "10-15 minutes",
    clorbCount: 45,
  },
];

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
];

export type TaskId = typeof TASKS[number]['id'];

export function getTaskById(id: string | undefined) {
  return TASKS.find(task => task.id === id) || TASKS[0];
}
