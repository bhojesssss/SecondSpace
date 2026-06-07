import { ref } from 'vue'
import { supabase } from '@/services/supabase'

// ── Singleton module-level state ──────────────────────────────────────────────
// `onlineUsers` is a reactive Set of profile ids that currently have the app open.
// Backed by a single Supabase Realtime *presence* channel shared across the whole
// app, so a user counts as "online" regardless of which page they are on.
const onlineUsers = ref(new Set())

let channel = null
let trackedUserId = null

function syncState() {
  if (!channel) return
  // presenceState() is keyed by the presence `key` we set (the user id), so the
  // set of online user ids is simply its keys.
  const state = channel.presenceState()
  onlineUsers.value = new Set(Object.keys(state))
}

export function usePresence() {
  /**
   * Join the global presence channel and announce that `userId` is online.
   * Safe to call repeatedly — it no-ops if already tracking the same user and
   * re-subscribes if the logged-in user changed.
   */
  function startPresence(userId) {
    if (!userId) return
    if (channel && trackedUserId === String(userId)) return
    stopPresence()
    trackedUserId = String(userId)

    // Public channel → presence works with the anon key, no extra auth needed.
    channel = supabase.channel('presence:online', {
      config: { presence: { key: String(userId) } },
    })

    channel
      .on('presence', { event: 'sync' }, syncState)
      .on('presence', { event: 'join' }, syncState)
      .on('presence', { event: 'leave' }, syncState)
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.track({ user_id: String(userId), online_at: new Date().toISOString() })
        }
      })
  }

  /** Leave the presence channel (e.g. on logout). */
  function stopPresence() {
    if (channel) {
      try {
        channel.untrack()
      } catch {
        // ignore — channel may already be closed
      }
      supabase.removeChannel(channel)
      channel = null
    }
    trackedUserId = null
    onlineUsers.value = new Set()
  }

  /** Reactive check: is the given profile id currently online? */
  function isOnline(userId) {
    return userId ? onlineUsers.value.has(String(userId)) : false
  }

  return { onlineUsers, isOnline, startPresence, stopPresence }
}
