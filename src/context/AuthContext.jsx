import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// ─── Display name generator ───────────────────────────────────────────────────
const ADJECTIVES = [
  'Sleepy', 'Grumpy', 'Tiny', 'Fuzzy', 'Cozy', 'Fluffy', 'Sassy',
  'Zesty', 'Bouncy', 'Chunky', 'Wobbly', 'Crispy', 'Soggy', 'Plump',
]
const NOUNS = ['Clorb', 'Blob', 'Sprout', 'Nugget', 'Pebble', 'Sock', 'Muffin', 'Noodle']

function generateDisplayName() {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num  = Math.floor(Math.random() * 99) + 1
  return `${adj}${noun}${num}`
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // onAuthStateChange handles token refreshes and sign-outs after boot,
    // but we do NOT use it to set loading=false — the init() function below
    // controls that, ensuring DB rows exist before the app renders.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setUser(session?.user ?? null)
    })

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        let authedUser = session?.user ?? null

        if (!authedUser) {
          const { data, error } = await supabase.auth.signInAnonymously({
            options: { data: { display_name: generateDisplayName() } },
          })
          if (error) {
            console.error('[Auth] Anonymous sign-in failed:', error.message)
            return
          }
          authedUser = data.user
        }

        // Ensure public.users and user_stats rows exist before unblocking the app.
        // This MUST finish before loading=false so FK constraints are satisfied
        // on any DB write that happens immediately after render.
        if (authedUser) {
          const displayName = authedUser.user_metadata?.display_name ?? generateDisplayName()

          const { error: uErr } = await supabase.from('users').upsert(
            { id: authedUser.id, display_name: displayName },
            { onConflict: 'id', ignoreDuplicates: true }
          )
          if (uErr) console.error('[Auth] users upsert failed:', uErr.message)

          const { error: sErr } = await supabase.from('user_stats').upsert(
            { user_id: authedUser.id },
            { onConflict: 'user_id', ignoreDuplicates: true }
          )
          if (sErr) console.error('[Auth] user_stats upsert failed:', sErr.message)

          if (mounted) setUser(authedUser)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const displayName = user?.user_metadata?.display_name ?? 'Clorb'

  return (
    <AuthContext.Provider value={{ user, displayName, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
