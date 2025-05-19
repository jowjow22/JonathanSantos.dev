import { HTMLMotionProps } from 'framer-motion'
import * as motion from 'motion/react-client'
import { button as variants } from './button.variants'

interface IButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variant' | 'children'> {
  variant?: 'primary' | 'secondary'
  onlyIcon?: boolean
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

export const Button = ({
  children,
  variant = 'primary',
  disabled,
  icon,
  className = '',
  onlyIcon,
  ...rest
}: IButtonProps) => {
  const class_variants = variants({ variant, disabled, onlyIcon })

  return (
    <motion.button
      className={`${class_variants} ${className}`}
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
