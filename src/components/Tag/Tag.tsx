import { type Icon, type IconProps } from '@tabler/icons-react'
import { type ForwardRefExoticComponent, type RefAttributes } from 'react'

interface ITagProps {
  text: string
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
  disabled?: boolean
  color?: string
}

export const Tag = ({ text, icon: Icon, disabled, color }: ITagProps) => {
  const iconElement = Icon ? (
    <Icon size={15} className="text-secondary-foreground" />
  ) : null
  return (
    <div
      className={`bg-secondary text-secondary-foreground flex max-h-fit items-center gap-x-2 rounded-full px-4 py-2 text-sm font-bold ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${color}`}
      style={{
        backgroundColor: disabled ? 'rgba(0, 0, 0, 0.5)' : color,
      }}
    >
      {iconElement && <span>{iconElement}</span>}
      <span className="text-sm">{text}</span>
    </div>
  )
}
