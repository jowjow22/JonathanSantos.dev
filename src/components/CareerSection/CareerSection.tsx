import { type Database } from '@/lib/types/database.types'
import { Skeleton } from '@/components/ui/skeleton'
import { Typography } from '@/components/Typography/Typography'
import { Reveal } from '@/animations/Reveal'
import { CareerTimelineEntry } from './CareerTimelineEntry'
import * as motion from 'motion/react-client'

type CareerEntry = Database['public']['Tables']['career_entries']['Row']

interface ICareerSectionProps {
  entries: CareerEntry[]
  isLoading: boolean
}

export const CareerSection = ({ entries, isLoading }: ICareerSectionProps) => {
  if (isLoading) {
    return (
      <>
        <Reveal>
          <Typography.H1>Career</Typography.H1>
        </Reveal>
        <div className="flex w-full flex-col gap-y-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex gap-x-4">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  if (entries.length === 0) {
    return (
      <>
        <Reveal>
          <Typography.H1>Career</Typography.H1>
        </Reveal>
        <Typography.Paragraph>Content coming soon.</Typography.Paragraph>
      </>
    )
  }

  const sortedEntries = [...entries].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  )

  return (
    <>
      <Reveal>
        <Typography.H1>Career</Typography.H1>
      </Reveal>
      <div className="flex w-full flex-col gap-y-8">
        {sortedEntries.map((entry, index) => {
          const fromLeft = index % 2 === 0
          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: fromLeft ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="w-full"
            >
              <CareerTimelineEntry
                entry={entry}
                isLast={index === sortedEntries.length - 1}
              />
            </motion.div>
          )
        })}
      </div>
    </>
  )
}
