import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase/client'

export function useLogout() {
  const navigate = useNavigate()

  const logout = async () => {
    await supabase.auth.signOut()
    navigate({ to: '/admin/login' })
  }

  return { logout }
}
