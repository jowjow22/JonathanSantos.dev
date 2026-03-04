import { type Database } from '@/lib/types/database.types'
import { Skeleton } from '@/components/ui/skeleton'
import { Typography } from '@/components/Typography/Typography'
import { Reveal } from '@/animations/Reveal'
import { SkillChip } from './SkillChip'
import * as motion from 'motion/react-client'

type Skill = Database['public']['Tables']['skills']['Row']
type SkillCategory = Database['public']['Tables']['skill_categories']['Row']

interface ISkillsSectionProps {
  skills: Skill[]
  categories: SkillCategory[]
  isLoading: boolean
}

const chipContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const chipItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

export const SkillsSection = ({
  skills,
  categories,
  isLoading,
}: ISkillsSectionProps) => {
  if (isLoading) {
    return (
      <>
        <Reveal>
          <Typography.H1>Skills</Typography.H1>
        </Reveal>
        <div className="flex w-full flex-col gap-y-8">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-col gap-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-9 w-24 rounded-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  if (skills.length === 0) {
    return (
      <>
        <Reveal>
          <Typography.H1>Skills</Typography.H1>
        </Reveal>
        <Typography.Paragraph>Content coming soon.</Typography.Paragraph>
      </>
    )
  }

  const grouped = categories
    .map((cat) => ({
      category: cat,
      skills: skills.filter((s) => s.category_id === cat.id),
    }))
    .filter((g) => g.skills.length > 0)

  const uncategorized = skills.filter((s) => s.category_id === null)

  return (
    <>
      <Reveal>
        <Typography.H1>Skills</Typography.H1>
      </Reveal>
      <div className="flex w-full flex-col gap-y-8">
        {grouped.map(({ category, skills: categorySkills }) => (
          <div key={category.id} className="flex flex-col gap-y-3">
            <Reveal>
              <Typography.H3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                {category.name}
              </Typography.H3>
            </Reveal>
            <motion.div
              variants={chipContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {categorySkills.map((skill) => (
                <motion.div key={skill.id} variants={chipItemVariants}>
                  <SkillChip name={skill.name} iconUrl={skill.icon_url} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))}
        {uncategorized.length > 0 && (
          <div className="flex flex-col gap-y-3">
            <Reveal>
              <Typography.H3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                Other
              </Typography.H3>
            </Reveal>
            <motion.div
              variants={chipContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap gap-2"
            >
              {uncategorized.map((skill) => (
                <motion.div key={skill.id} variants={chipItemVariants}>
                  <SkillChip name={skill.name} iconUrl={skill.icon_url} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </>
  )
}
