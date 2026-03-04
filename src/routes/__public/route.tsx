import { Navbar } from '@/components/Navbar/Navbar'
import { createFileRoute, useMatchRoute } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import { AnimatedOutlet } from '@/animations/AnimatedOutlet'

export const Route = createFileRoute('/__public')({
  component: PublicLayout,
})

export default function PublicLayout() {
  const matchRoute = useMatchRoute()
  const isProjectDetail = matchRoute({ to: '/projects/$projectId' })

  return (
    <MotionConfig reducedMotion="user">
      {!isProjectDetail && <Navbar />}
      <main>
        <AnimatedOutlet />
      </main>
    </MotionConfig>
  )
}
