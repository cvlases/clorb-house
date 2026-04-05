import { useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * useChoreSession — manages a single chore_sessions row lifecycle.
 *
 * Call startSession() when the timer begins.
 * Call completeSession() when the timer hits zero.
 * Call abandonSession() on give-up or app backgrounding.
 */
export function useChoreSession() {
  const { user } = useAuth()
  const sessionIdRef  = useRef(null)
  const startTimeRef  = useRef(null)

  const startSession = useCallback(async (choreType) => {
    if (!user) return null
    startTimeRef.current = Date.now()

    const { data, error } = await supabase
      .from('chore_sessions')
      .insert({ user_id: user.id, chore_type: choreType, status: 'active' })
      .select('id')
      .single()

    if (error) {
      console.error('[ChoreSession] start failed:', error.message)
      return null
    }

    sessionIdRef.current = data.id
    return data.id
  }, [user])

  const completeSession = useCallback(async () => {
    if (!user || !sessionIdRef.current) return
    const elapsed = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : 0

    await supabase
      .from('chore_sessions')
      .update({
        status:       'completed',
        completed_at: new Date().toISOString(),
        duration_sec: elapsed,
      })
      .eq('id', sessionIdRef.current)

    await _updateStats(user.id, 'completed')
    sessionIdRef.current = null
  }, [user])

  const abandonSession = useCallback(async () => {
    if (!user || !sessionIdRef.current) return

    await supabase
      .from('chore_sessions')
      .update({
        status:      'abandoned',
        given_up_at: new Date().toISOString(),
      })
      .eq('id', sessionIdRef.current)

    await _updateStats(user.id, 'abandoned')
    sessionIdRef.current = null
  }, [user])

  return { startSession, completeSession, abandonSession }
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

async function _updateStats(userId, outcome) {
  // maybeSingle() returns null (not an error) when no row exists
  const { data: stats } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (!stats) {
    // Row doesn't exist — insert it, then stop. Next completion will update.
    await supabase.from('user_stats').insert({ user_id: userId })
    return
  }

  const today     = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0]

  if (outcome === 'completed') {
    let streak = stats.current_streak ?? 0

    if (!stats.last_chore_date) {
      streak = 1
    } else if (stats.last_chore_date === today) {
      // Already completed something today — streak unchanged
    } else if (stats.last_chore_date === yesterday) {
      streak += 1
    } else {
      streak = 1 // Gap in streak — reset
    }

    await supabase
      .from('user_stats')
      .update({
        total_completed: (stats.total_completed ?? 0) + 1,
        current_streak:  streak,
        longest_streak:  Math.max(stats.longest_streak ?? 0, streak),
        last_chore_date: today,
      })
      .eq('user_id', userId)
  } else {
    // Abandoned — reset current streak
    await supabase
      .from('user_stats')
      .update({ current_streak: 0 })
      .eq('user_id', userId)
  }
}
