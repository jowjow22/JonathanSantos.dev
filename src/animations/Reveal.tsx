import * as motion from 'motion/react-client'

interface IRevealProps {
  children: React.ReactNode
  width?: 'w-fit' | 'w-full'
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
}
export const Reveal = ({ children, width = 'w-fit' }: IRevealProps) => {
  return (
    <div className={`relative overflow-hidden ${width}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={{
          duration: 0.5,
          delay: 0.25,
        }}
      >
        {children}
      </motion.div>
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: '100%' },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, ease: 'easeIn' }}
        className="absolute top-0 right-0 bottom-4 left-0 z-20 h-full bg-indigo-700"
      />
    </div>
  )
}
