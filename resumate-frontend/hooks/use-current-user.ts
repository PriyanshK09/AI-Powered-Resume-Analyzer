import { useEffect, useState, useCallback, useRef } from 'react'

export interface CurrentUser {
  id: string
  email: string
  name?: string | null
}

interface State {
  user: CurrentUser | null
  loading: boolean
  error: string | null
}

// Lightweight in-memory cache (per module) so multiple components don't refetch simultaneously
let cachedUser: CurrentUser | null | undefined = undefined // undefined => not loaded yet
let pendingPromise: Promise<CurrentUser | null> | null = null

async function fetchCurrentUser(signal?: AbortSignal): Promise<CurrentUser | null> {
  try {
    const res = await fetch('/api/auth/me', { method: 'GET', credentials: 'include', signal, headers: { 'Accept': 'application/json' } })
    if (res.status === 401) return null
    if (!res.ok) throw new Error('Failed to load user')
    const data = await res.json().catch(() => null)
    if (!data || !data.success) return null
    return data.user as CurrentUser
  } catch (e) {
    if ((e as any)?.name === 'AbortError') return null
    throw e
  }
}

export function useCurrentUser() {
  const [state, setState] = useState<State>(() => ({ user: cachedUser ?? null, loading: cachedUser === undefined, error: null }))
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (cachedUser !== undefined) { // already have cached value
      setState(s => ({ ...s, user: cachedUser ?? null, loading: false }))
      return
    }
    let active = true
    if (!pendingPromise) {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      pendingPromise = fetchCurrentUser(controller.signal).then(u => {
        cachedUser = u
        return u
      }).finally(() => { pendingPromise = null })
    }
    pendingPromise.then(u => {
      if (!active) return
      setState({ user: u, loading: false, error: null })
    }).catch(err => {
      if (!active) return
      setState({ user: null, loading: false, error: err.message || 'Failed to load user' })
    })
    return () => { active = false; abortRef.current?.abort() }
  }, [])

  const refresh = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const u = await fetchCurrentUser(controller.signal)
      cachedUser = u
      setState({ user: u, loading: false, error: null })
      return u
    } catch (e:any) {
      setState({ user: null, loading: false, error: e.message || 'Failed to load user' })
      return null
    }
  }, [])

  return { ...state, refresh }
}

export function primeCurrentUser(user: CurrentUser | null) {
  cachedUser = user
}
