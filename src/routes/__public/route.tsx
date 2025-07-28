import { Navbar } from '@/components/Navbar/Navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/__public')({
  component: PublicLayout,
})

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
