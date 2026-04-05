// ─── Reward Requirements ──────────────────────────────────────────────────────
// Each reward requires a certain number of completed chore_sessions of a given
// chore_type. The Rewards screen queries chore_sessions to compute progress.

export const REWARDS = [
  {
    id: 'mise',
    name: 'The Mise en Place Bundle',
    requiresChoreType: 'dishes',
    requiresCount: 3,
    reward: '15% discount at a specialty spice retailer',
    emoji: '🧂',
  },
  {
    id: 'design',
    name: 'The Design Sprint Survivor',
    requiresChoreType: 'emails',
    requiresCount: 3,
    reward: '$5 credit for a digital asset store (fonts, UI kits...)',
    emoji: '🎨',
  },
  {
    id: 'polyglot',
    name: 'The Polyglot Pack',
    requiresChoreType: 'bed',
    requiresCount: 4,
    reward: '1-month premium language learning subscription',
    emoji: '🗣️',
  },
  {
    id: 'commuter',
    name: "The Commuter's Relief",
    requiresChoreType: 'trash',
    requiresCount: 2,
    reward: 'Free premium car wash coupon',
    emoji: '🚗',
  },
  {
    id: 'laundry',
    name: 'The Laundry Day Haul',
    requiresChoreType: 'laundry',
    requiresCount: 5,
    reward: '$2 Amazon coupon for laundry detergent',
    emoji: '🧺',
  },
  {
    id: 'datenight',
    name: 'The Date Night Stash',
    requiresChoreType: 'sweep',
    requiresCount: 2,
    reward: 'Buy-One-Get-One AMC movie ticket voucher',
    emoji: '🎬',
  },
]

// Map chore type id → display label for requirements UI
export const CHORE_LABELS = {
  laundry: 'laundry session',
  emails:  'email session',
  bed:     'bed-making session',
  dishes:  'dishes session',
  sweep:   'sweep session',
  trash:   'trash run',
  dry:     'drying session',
  wipe:    'wipe-down session',
  misc:    'misc chore',
}
