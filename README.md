# Clorb - Virtual Body-Doubling Task App

A gamified, virtual body-doubling application designed to reduce friction and executive dysfunction associated with household chores.

## Concept

Clorb combines cozy, low-fi web aesthetics with slightly threatening, absurd gamification to help you complete tasks through virtual companionship.

## Unity

Unity App was made alongside for demoing: https://github.com/chowwil/CLORB-Unity

## Core Features

### 🎮 Virtual Body Doubling
- MMO-style execution room with other Clorbs working alongside you
- Real-time social proof showing how many Clorbs are doing each task
- Animated Clorb characters providing companionship

### ⏱️ Task Flow
1. **Welcome** - Meet your Clorb companion
2. **Task Selection** - Choose from common household chores
3. **Time Setting** - Set your task duration with intuitive pickers
4. **Execution Room** - Complete your task with Clorbs cheering you on
5. **Reward** - Open a gacha box for delightfully mundane rewards
6. **Funeral** - Face the consequences of giving up (with high friction)

### 🎁 Gacha Reward System
Earn absurdly mundane rewards:
- **Common**: Dry macaroni, damp sponge
- **Uncommon**: "World's Okayest Clorb" mug, old receipts
- **Rare**: Tax form hat
- **Legendary**: The Ultimate Sock (unmatched argyle)

### 🎨 Design Aesthetic
- Cozy, low-fi web aesthetics
- Hand-drawn Clorb characters
- Playful, slightly absurd tone
- Bold colors and chunky borders

## Technical Stack

- **React** - UI framework
- **React Router** - Navigation
- **Motion (Framer Motion)** - Animations
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety
- **Canvas Confetti** - Celebration effects

## Project Structure

```
src/
├── app/
│   ├── screens/          # Main app screens
│   │   ├── Welcome.tsx
│   │   ├── MeetClorb.tsx
│   │   ├── TodoList.tsx
│   │   ├── TaskSelect.tsx
│   │   ├── TimeSelect.tsx
│   │   ├── ExecutionRoom.tsx
│   │   ├── Reward.tsx
│   │   └── Funeral.tsx
│   ├── constants/        # App constants and data
│   │   └── tasks.ts
│   ├── components/       # Reusable components
│   │   └── MobileContainer.tsx
│   ├── routes.tsx        # Router configuration
│   └── App.tsx          # Root component
├── imports/             # Figma-imported assets
└── styles/              # Global styles
```

## Available Tasks

- 🧺 **Do Laundry** - 103 Clorbs currently working
- 🛏️ **Make Bed** - 28 Clorbs currently working
- 🍽️ **Clean Dishes** - 127 Clorbs currently working
- 🗑️ **Take Out Trash** - 78 Clorbs currently working
- 🧹 **Clean Floors** - 45 Clorbs currently working

## Interactions

### Execution Room
- **Add Time**: Extend your task timer in 5-minute increments
- **Task Done**: Complete the task early and get your reward
- **Give Up**: Trigger the high-friction funeral flow
- **Chat**: (Coming soon) Communicate with other Clorbs

### Idle Messages
Clorb will occasionally offer "encouragement":
- "The digital dishes are clean. Are the real ones? I doubt it."
- "Tasks don't do themselves. Unfortunately."
- "Clorb believes in you. Probably."

## Design Philosophy

**Emotional Friction**: The "Clorb Funeral" heavily penalizes task abandonment with guilt and ceremony.

**Variable Reward Schedule**: Gacha mechanics drive retention through unpredictable, absurd rewards.

**Social Proof**: Seeing hundreds of Clorbs working creates accountability and reduces task isolation.

**Absurd Humor**: Nothing is taken too seriously. Even failure has whimsy.

## Future Enhancements

- Real multiplayer rooms
- Clorb customization with rewards
- Streak tracking and achievements
- Task-specific animations
- Voice/sound effects
- More absurd reward items

---

Built with ❤️ and a healthy dose of executive dysfunction.
