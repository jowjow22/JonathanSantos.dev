import { type Icon, type IconProps } from '@tabler/icons-react'
import { type ForwardRefExoticComponent, type RefAttributes } from 'react'

interface ITagProps {
  text: string
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>
  disabled?: boolean
  color?: string
}

export const Tag = ({ text, icon: Icon, disabled, color }: ITagProps) => {
  const iconElement = Icon ? <Icon size={15} className="text-zinc-200" /> : null
  return (
    <div
      className={`flex items-center gap-x-2 rounded-full px-4 py-2 max-h-fit text-sm font-bold text-zinc-200 bg-zinc-800 ${
        disabled ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${color}`}
      style={{
        backgroundColor: disabled ? 'rgba(0, 0, 0, 0.5)' : color,
      }}
    >
      {iconElement && <span className="text-zinc-200">{iconElement}</span>}
      <span className="text-sm">{text}</span>
    </div>
  )
}
