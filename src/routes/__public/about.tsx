import { CardExpandedContent } from '@/components/CardExpandedContent/CardExpandedContent'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__public/about')({
  component: About,
})

function About() {
  return <CardExpandedContent />
}
