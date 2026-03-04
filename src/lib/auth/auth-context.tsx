import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}

export function useAuthContext(): AuthState {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  })

  useEffect(() => {
    // Resolve existing session from sessionStorage on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuth({
        isAuthenticated: session !== null,
        isLoading: false,
        user: session?.user ?? null,
      })
    })

    // React to future auth events (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuth({
        isAuthenticated: session !== null,
        isLoading: false,
        user: session?.user ?? null,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  return auth
}
