import { useRef } from 'react'
import { Card } from '@/components/Card/Card'
import { Tag } from '@/components/Tag/Tag'
import { TagGroup } from '@/components/TagGroup/TagGroup'
import { Typography } from '@/components/Typography/Typography'
import { Skeleton } from '@/components/ui/skeleton'
import { trackEvent } from '@/lib/analytics'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import * as motion from 'motion/react-client'
import { useMotionValue, useTransform, useSpring } from 'motion/react'
import { useNavigate } from '@tanstack/react-router'
import { usePublishedProjectsWithThumbnails } from '@/hooks/useProjects'

function TiltCard({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 300,
    damping: 30,
  })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ y: -4 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="h-full w-full cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
    >
      {children}
    </motion.div>
  )
}

export const ProjectsSection = () => {
  const navigate = useNavigate()
  const { data: projects = [], isLoading } =
    usePublishedProjectsWithThumbnails()

  const goToProject = (projectId: string, projectTitle: string) => {
    trackEvent('project_click', {
      project_id: projectId,
      project_title: projectTitle,
    })
    navigate({ to: '/projects/$projectId', params: { projectId } })
  }

  const projectItems =
    projects.length === 0 ? (
      <CarouselItem className="px-6">
        <Typography.Paragraph>Content coming soon.</Typography.Paragraph>
      </CarouselItem>
    ) : (
      projects.map((project, index) => (
        <CarouselItem
          key={project.id}
          className="px-6 md:basis-1/2 xl:basis-1/3"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="h-full"
          >
            <TiltCard onClick={() => goToProject(project.id, project.title)}>
              <Card
                variant="image_background"
                image={{
                  src: project.thumbnail_url ?? '/sample-project.png',
                  alt: project.title,
                }}
              >
                <Card.Content>
                  <Typography.H3 className="font-bold text-white!">
                    {project.title}
                  </Typography.H3>
                  <p className="line-clamp-2 overflow-hidden text-ellipsis">
                    {project.description}
                  </p>
                </Card.Content>
                <Card.Footer>
                  <TagGroup>
                    {project.tech_stack.map((tech) => (
                      <Tag key={tech} text={tech} />
                    ))}
                  </TagGroup>
                </Card.Footer>
              </Card>
            </TiltCard>
          </motion.div>
        </CarouselItem>
      ))
    )

  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent className="px-2 py-4">
        {isLoading
          ? Array.from({ length: 3 }, (_, index) => (
              <CarouselItem
                key={`skeleton-${index}`}
                className="px-6 md:basis-1/2 xl:basis-1/3"
              >
                <Card variant="image_background">
                  <Card.Header>
                    <Skeleton className="h-8 w-8 rounded" />
                  </Card.Header>
                  <Card.Content>
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-1 h-4 w-2/3" />
                  </Card.Content>
                  <Card.Footer>
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </Card.Footer>
                </Card>
              </CarouselItem>
            ))
          : projectItems}
      </CarouselContent>
      <CarouselPrevious className="hidden rounded-sm border-none bg-indigo-600 sm:flex" />
      <CarouselNext className="hidden rounded-sm border-none bg-indigo-600 sm:flex" />
    </Carousel>
  )
}
