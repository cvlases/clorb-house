import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * useStats — fetches and exposes user_stats for the current user.
 * Call refresh() after any chore completion or abandonment.
 */
export function useStats() {
  const { user } = useAuth()
  const [stats,   setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()
    setStats(data ?? null)
    setLoading(false)
  }, [user])

  useEffect(() => { refresh() }, [refresh])

  return { stats, loading, refresh }
}
