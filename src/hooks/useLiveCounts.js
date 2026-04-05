import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useLiveCounts — subscribes (read-only) to all chore room presence channels
 * and returns a live map of { [choreType]: count }.
 */
export function useLiveCounts(choreTypes) {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    if (!choreTypes?.length) return

    const channels = choreTypes.map((type) => {
      const ch = supabase.channel(`room:${type}`)

      const update = () => {
        const count = Object.values(ch.presenceState()).flat().length
        setCounts((prev) => ({ ...prev, [type]: count }))
      }

      ch.on('presence', { event: 'sync' },  update)
        .on('presence', { event: 'join' },  update)
        .on('presence', { event: 'leave' }, update)
        .subscribe()

      return ch
    })

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch))
    }
  }, [choreTypes.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  return counts
}
