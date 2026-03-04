import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

export const Route = createFileRoute('/admin/__guard')({
  beforeLoad: ({ context }) => {
    // Defer redirect until initial session check completes
    if (context.auth.isLoading) return
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/admin/login' })
    }
  },
  component: AdminGuardLayout,
})

function AdminGuardLayout() {
  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar />
      <main className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-4">
          {/* SidebarTrigger (hamburger) is only shown on mobile — sidebar is always-visible on desktop */}
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
        </header>
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
      <Toaster position="bottom-right" />
    </SidebarProvider>
  )
}
