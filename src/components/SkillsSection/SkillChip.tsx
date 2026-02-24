import { IconCode } from '@tabler/icons-react'

interface ISkillChipProps {
  name: string
  iconUrl: string | null
}

export const SkillChip = ({ name, iconUrl }: ISkillChipProps) => (
  <div className="bg-secondary text-secondary-foreground flex items-center gap-x-2 rounded-full px-4 py-2 text-sm font-semibold">
    {iconUrl ? (
      <img src={iconUrl} alt={name} className="size-4 object-contain" />
    ) : (
      <IconCode size={15} className="text-muted-foreground" />
    )}
    <span>{name}</span>
  </div>
)
