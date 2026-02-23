import { ProjectsSection } from '@/components/ProjectsSection/ProjectsSection'
import { createFileRoute, Outlet, useMatch } from '@tanstack/react-router'
import { motion } from 'motion/react'

export const Route = createFileRoute('/__public/projects')({
  component: ProjectsRoute,
})

function ProjectsRoute() {
  const match = useMatch({
    from: '/__public/projects/$projectId',
    shouldThrow: false,
  })
  return (
    <section>
      <ProjectsSection />

      {match && (
        <motion.div
          key={match.params.projectId}
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <Outlet />
        </motion.div>
      )}
    </section>
  )
}
