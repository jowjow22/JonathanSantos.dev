import * as motion from "motion/react-client"

interface IButtonProps {
    children: React.ReactNode
}

export const Button = ({children}: IButtonProps) => {
  return (
    <motion.button
        className="border-1 border-solid border-black px-4 py-2 min-x-[64px] bg-indigo-800 rounded font-bold"
        whileHover={{
            scale: 1.05
        }}
        whileTap={{
            scale: 0.95
        }}
        transition={{
            type: 'spring',
            duration: '0.5'
        }}
    >
        {children}
    </motion.button>
  )
}
