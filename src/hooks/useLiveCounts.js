import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useLiveCounts — subscribes (read-only) to all chore room presence channels
 * and returns a map of { [choreType]: count } updated in real time.
 *
 * Used by TodoList to show how many Clorbs are currently in each room.
 */
export function useLiveCounts(choreTypes) {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    if (!choreTypes?.length) return

    const channels = choreTypes.map((type) => {
      const ch = supabase.channel(`room:${type}`)

      ch.on('presence', { event: 'sync' }, () => {
        const count = Object.values(ch.presenceState()).flat().length
        setCounts((prev) => ({ ...prev, [type]: count }))
      }).subscribe()

      return ch
    })

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch))
    }
  }, [choreTypes.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  return counts
}
