import { HTMLMotionProps } from 'framer-motion'
import * as motion from 'motion/react-client'

interface IButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variant' | 'children'> {
  variant?: 'primary' | 'secondary'
  onlyIcon?: boolean
  icon?: React.ReactNode
  disabled?: boolean
  children?: React.ReactNode
}

export const Button = ({
  children,
  variant = 'primary',
  disabled,
  icon,
  onlyIcon,
  ...rest
}: IButtonProps) => {
  const base_class = `px-4 py-2 min-x-[64px] rounded font-bold cursor-pointer font-poppins transition-colors duration-200 flex flex-row items-center gap-x-1`
  const variant_class = {
    primary:
      'bg-indigo-800 text-white hover:bg-indigo-900 active:bg-indigo-700',
    secondary:
      'bg-transparent text-white border-2 border-solid border-gray-600/50 hover:bg-gray-600/50',
  }
  const disabled_class = 'cursor-not-allowed! opacity-50'
  const icon_class = 'px-2! py-2'

  return (
    <motion.button
      className={`${base_class} ${variant_class[variant]} ${onlyIcon ? icon_class : ''} ${
        disabled ? disabled_class : ''
      }`}
      disabled={disabled}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 0.08,
        },
      }}
      transition={{
        duration: 0.1,
      }}
      {...rest}
    >
      {!onlyIcon && children}
      {icon}
    </motion.button>
  )
}
