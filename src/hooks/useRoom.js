import { useEffect, useRef, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

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

export function useRoom(choreType) {
  const { user, displayName } = useAuth()
  const [roomClorbs, setRoomClorbs] = useState([])

  const posMap     = useRef(new Map())
  const nextPosIdx = useRef(1)
  const channelRef = useRef(null)

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
        id:           entry.user_id,
        taskId:       entry.chore_type,
        displayName:  entry.display_name,
        userMessage:  entry.user_message ?? null,
        isUser:       entry.user_id === user?.id,
        xPct:         pos.xPct,
        yPct:         pos.yPct,
        animationDelay: idx * 0.08,
      }
    })
    clorbs.sort((a, b) => (b.isUser ? 1 : 0) - (a.isUser ? 1 : 0))
    return clorbs
  }

  useEffect(() => {
    if (!user || !choreType) return

    posMap.current.set(user.id, ROOM_POSITIONS[0])
    setRoomClorbs([{
      id:           user.id,
      taskId:       choreType,
      displayName,
      userMessage:  null,
      isUser:       true,
      xPct:         ROOM_POSITIONS[0].xPct,
      yPct:         ROOM_POSITIONS[0].yPct,
      animationDelay: 0,
    }])

    const channel = supabase.channel(`room:${choreType}`, {
      config: { presence: { key: user.id } },
    })
    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' },  () => setRoomClorbs(buildClorbs(channel.presenceState())))
      .on('presence', { event: 'join' },  () => setRoomClorbs(buildClorbs(channel.presenceState())))
      .on('presence', { event: 'leave' }, () => setRoomClorbs(buildClorbs(channel.presenceState())))
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id:      user.id,
            display_name: displayName,
            chore_type:   choreType,
            started_at:   new Date().toISOString(),
            user_message: null,
          })
        }
      })

    return () => {
      // Guard: leaveRoom() may have already cleaned up
      const ch = channelRef.current
      if (ch) {
        channelRef.current = null
        ch.untrack().then(() => supabase.removeChannel(ch))
      }
    }
  }, [user?.id, choreType]) // eslint-disable-line react-hooks/exhaustive-deps

  const leaveRoom = useCallback(async () => {
    const ch = channelRef.current
    if (!ch) return
    await ch.untrack()
    supabase.removeChannel(ch)
    channelRef.current = null
  }, [])

  // Re-tracks with the new message so all other clients see it immediately
  const updateMessage = useCallback(async (message) => {
    const ch = channelRef.current
    if (!ch || !user) return
    await ch.track({
      user_id:      user.id,
      display_name: displayName,
      chore_type:   choreType,
      started_at:   new Date().toISOString(),
      user_message: message,
    })
  }, [user, displayName, choreType])

  return { roomClorbs, leaveRoom, updateMessage }
}
