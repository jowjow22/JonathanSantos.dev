import * as motion from 'motion/react-client'

interface IButtonProps {
  children: React.ReactNode
}

export const Button = ({ children }: IButtonProps) => {
  return (
    <motion.button
      className="border-1 border-solid border-black px-4 py-2 min-x-[64px] rounded font-bold cursor-pointer font-poppins"
      initial={{
        background: 'var(--color-indigo-800)',
        color: 'var(--color-white)',
      }}
      whileHover={{
        background: 'var(--color-indigo-900)',
      }}
      whileTap={{
        scale: 0.95,
        transition: {
          duration: 0.08,
        },
      }}
      transition={{
        duration: 0.1,
      }}
    >
      {children}
    </motion.button>
  )
}
