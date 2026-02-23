import { motion } from 'framer-motion'

export const CardExpandedContent = ({ projectId }: { projectId: string }) => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      style={{ pointerEvents: 'auto' }}
      className="fixed top-0 left-0 z-[1000] grid h-screen w-screen place-items-center before:fixed before:inset-0 before:bg-black/50"
    >
      <motion.div
        layoutId={`card-content-${projectId}`}
        className="relative inset-0 h-32 w-32 bg-white text-black"
      >
        asdas
      </motion.div>
    </motion.article>
  )
}
