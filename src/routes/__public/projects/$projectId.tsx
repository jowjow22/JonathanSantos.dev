import { createFileRoute, Link } from '@tanstack/react-router'
import { fetchPublishedProjectById } from '@/services/projects.service'
import { usePublishedProject, usePublishedProjects } from '@/hooks/useProjects'
import { useProjectImages } from '@/hooks/useProjectImages'
import { Typography } from '@/components/Typography/Typography'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import {
  IconBrandGithub,
  IconExternalLink,
  IconBook,
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'

export const Route = createFileRoute('/__public/projects/$projectId')({
  loader: async ({ params }) => {
    const project = await fetchPublishedProjectById(params.projectId)
    return { project }
  },
  head: (ctx) => {
    const p = ctx.loaderData?.project
    const title = p
      ? `${p.title} — Jonathan Santos`
      : 'Project — Jonathan Santos'
    const description = p?.description?.slice(0, 155) ?? ''
    return {
      meta: [
        { title },
        { name: 'description', content: description },
        {
          property: 'og:title',
          content: p?.title ?? 'Project — Jonathan Santos',
        },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
      ],
    }
  },
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { projectId } = Route.useParams()

  const { data: project, isLoading: projectLoading } =
    usePublishedProject(projectId)
  const { data: images = [], isLoading: imagesLoading } =
    useProjectImages(projectId)
  const { data: allProjects = [] } = usePublishedProjects()

  const isLoading = projectLoading || imagesLoading

  // Compute prev/next based on sort_order
  const sorted = [...allProjects].sort((a, b) => a.sort_order - b.sort_order)
  const currentIndex = sorted.findIndex((p) => p.id === projectId)
  const prevProject = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const nextProject =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Back link skeleton */}
        <Skeleton className="mb-8 h-6 w-40" />

        {/* Carousel skeleton */}
        <Skeleton className="mb-6 h-72 w-full rounded-xl" />

        {/* Title skeleton */}
        <Skeleton className="mb-4 h-8 w-96" />

        {/* Description skeletons */}
        <div className="mb-6 flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* Tech chip skeletons */}
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-16 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link
          to="/"
          hash="projects"
          className="mb-8 flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-200"
        >
          <IconArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
        <Typography.H2>Project not found</Typography.H2>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Back link */}
      <Link
        to="/"
        hash="projects"
        className="mb-8 inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-200"
      >
        <IconArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Projects</span>
      </Link>

      {/* Image carousel — only shown if images exist */}
      {images.length > 0 && (
        <div className="relative mb-8 px-10">
          <Carousel opts={{ align: 'start', loop: true }}>
            <CarouselContent>
              {images.map((img) => (
                <CarouselItem key={img.id}>
                  <img
                    src={img.signedUrl}
                    alt={img.alt_text ?? project.title}
                    className="h-72 w-full rounded-xl object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}

      {/* Title + conditional links */}
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <Typography.H1 className="flex-1">{project.title}</Typography.H1>

        <div className="flex flex-wrap items-center gap-2">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            >
              <IconBrandGithub size={18} />
              GitHub
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            >
              <IconExternalLink size={18} />
              Live Demo
            </a>
          )}
          {project.case_study_url && (
            <a
              href={project.case_study_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            >
              <IconBook size={18} />
              Case Study
            </a>
          )}
        </div>
      </div>

      {/* Tech stack chips */}
      {project.tech_stack.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-200"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div className="mb-8">
          <Typography.Paragraph>{project.description}</Typography.Paragraph>
        </div>
      )}

      {/* Prev / Next navigation */}
      {(prevProject || nextProject) && (
        <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-6">
          {prevProject ? (
            <Link
              to="/projects/$projectId"
              params={{ projectId: prevProject.id }}
              className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <IconChevronLeft size={18} />
              <span>{prevProject.title}</span>
            </Link>
          ) : (
            <span />
          )}

          {nextProject ? (
            <Link
              to="/projects/$projectId"
              params={{ projectId: nextProject.id }}
              className="flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              <span>{nextProject.title}</span>
              <IconChevronRight size={18} />
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  )
}
