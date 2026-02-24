import { useEffect } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { useAuthContext } from '@/lib/auth/auth-context'
import { router } from './main'

export function App() {
  const auth = useAuthContext()

  // Re-run all beforeLoad guards whenever auth state resolves or changes
  useEffect(() => {
    router.invalidate()
  }, [auth.isAuthenticated, auth.isLoading])

  return <RouterProvider router={router} context={{ auth }} />
}
