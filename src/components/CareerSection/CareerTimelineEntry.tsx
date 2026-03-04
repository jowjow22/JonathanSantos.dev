import { IconBriefcase, IconSchool, IconStar } from '@tabler/icons-react'
import { type Database } from '@/lib/types/database.types'
import { Typography } from '@/components/Typography/Typography'
import { dateFormatter } from '@/lib/helpers/date-formater'

interface ICareerTimelineEntryProps {
  entry: Database['public']['Tables']['career_entries']['Row']
  isLast?: boolean
}

const ENTRY_TYPE_CONFIG = {
  job: {
    Icon: IconBriefcase,
    colorClass: 'text-indigo-400 bg-indigo-900/30',
  },
  education: {
    Icon: IconSchool,
    colorClass: 'text-emerald-400 bg-emerald-900/30',
  },
  milestone: {
    Icon: IconStar,
    colorClass: 'text-amber-400 bg-amber-900/30',
  },
} as const

export const CareerTimelineEntry = ({
  entry,
  isLast = false,
}: ICareerTimelineEntryProps) => {
  const config = ENTRY_TYPE_CONFIG[entry.type]
  const { Icon, colorClass } = config

  const startLabel = dateFormatter(entry.start_date)
  const endLabel = entry.is_current
    ? 'Present'
    : entry.end_date
      ? dateFormatter(entry.end_date)
      : ''
  const dateRange = `${startLabel}${endLabel ? ` – ${endLabel}` : ''}`

  return (
    <div className="relative flex gap-x-4">
      {/* Left column: icon circle */}
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${colorClass}`}
      >
        <Icon size={20} />
      </div>

      {/* Connecting vertical line */}
      {!isLast && (
        <div className="bg-border absolute top-10 left-5 h-full w-0.5" />
      )}

      {/* Right column: content */}
      <div className="flex flex-col gap-y-1 pb-8">
        <Typography.H4>{entry.title}</Typography.H4>
        {entry.company && (
          <Typography.Paragraph className="text-muted-foreground">
            {entry.company}
          </Typography.Paragraph>
        )}
        <Typography.Paragraph className="text-muted-foreground text-xs">
          {dateRange}
        </Typography.Paragraph>
        {entry.description && (
          <Typography.Paragraph className="mt-1">
            {entry.description}
          </Typography.Paragraph>
        )}
      </div>
    </div>
  )
}
