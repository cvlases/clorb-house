import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// ─── Room positions (landscape room, 844×390) ─────────────────────────────────
const ROOM_POSITIONS = [
  { xPct: 12, yPct: 32 },
  { xPct: 24, yPct: 56 },
  { xPct: 36, yPct: 28 },
  { xPct: 48, yPct: 60 },
  { xPct: 58, yPct: 33 },
  { xPct: 68, yPct: 52 },
  { xPct: 78, yPct: 28 },
  { xPct: 18, yPct: 68 },
  { xPct: 42, yPct: 72 },
  { xPct: 62, yPct: 66 },
]

/**
 * useRoom — join a Supabase Realtime Presence channel for a chore room.
 *
 * Returns roomClorbs: the live list of users in the room, shaped for
 * ExecutionRoom to render directly (same structure as the old mock clorbs).
 */
export function useRoom(choreType) {
  const { user, displayName } = useAuth()
  const [roomClorbs, setRoomClorbs] = useState([])

  // Stable position map: userId → { xPct, yPct }
  // Positions are assigned on first appearance and never reassigned.
  const posMap      = useRef(new Map())
  const nextPosIdx  = useRef(1) // index 0 reserved for the current user
  const channelRef  = useRef(null)

  function assignPosition(userId) {
    if (userId === user?.id) return ROOM_POSITIONS[0]
    if (posMap.current.has(userId)) return posMap.current.get(userId)
    const pos = ROOM_POSITIONS[nextPosIdx.current % ROOM_POSITIONS.length]
    nextPosIdx.current += 1
    posMap.current.set(userId, pos)
    return pos
  }

  function buildClorbs(presenceState) {
    const entries = Object.values(presenceState).flat()
    const clorbs = entries.map((entry, idx) => {
      const pos = assignPosition(entry.user_id)
      return {
        id:             entry.user_id,
        taskId:         entry.chore_type,
        displayName:    entry.display_name,
        isUser:         entry.user_id === user?.id,
        xPct:           pos.xPct,
        yPct:           pos.yPct,
        animationDelay: idx * 0.08,
      }
    })
    // Current user's clorb always first so vigil logic can rely on it
    clorbs.sort((a, b) => (b.isUser ? 1 : 0) - (a.isUser ? 1 : 0))
    return clorbs
  }

  useEffect(() => {
    if (!user || !choreType) return

    // Show the user's own clorb immediately — don't wait for Presence to sync
    posMap.current.set(user.id, ROOM_POSITIONS[0])
    setRoomClorbs([{
      id:             user.id,
      taskId:         choreType,
      displayName,
      isUser:         true,
      xPct:           ROOM_POSITIONS[0].xPct,
      yPct:           ROOM_POSITIONS[0].yPct,
      animationDelay: 0,
    }])

    const channel = supabase.channel(`room:${choreType}`, {
      config: { presence: { key: user.id } },
    })
    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, () => {
        setRoomClorbs(buildClorbs(channel.presenceState()))
      })
      .on('presence', { event: 'join' }, () => {
        setRoomClorbs(buildClorbs(channel.presenceState()))
      })
      .on('presence', { event: 'leave' }, () => {
        setRoomClorbs(buildClorbs(channel.presenceState()))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id:     user.id,
            display_name: displayName,
            chore_type:  choreType,
            started_at:  new Date().toISOString(),
          })
        }
      })

    return () => {
      channel.untrack().then(() => supabase.removeChannel(channel))
    }
  }, [user?.id, choreType]) // eslint-disable-line react-hooks/exhaustive-deps

  const leaveRoom = useCallback(async () => {
    const ch = channelRef.current
    if (!ch) return
    await ch.untrack()
    supabase.removeChannel(ch)
    channelRef.current = null
  }, [])

  return { roomClorbs, leaveRoom }
}
