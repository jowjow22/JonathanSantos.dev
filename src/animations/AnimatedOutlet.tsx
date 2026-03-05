import { forwardRef, useContext, useRef } from 'react'
import {
  Outlet,
  getRouterContext,
  useMatch,
  useMatches,
} from '@tanstack/react-router'
import {
  AnimatePresence,
  useIsPresent,
  motion,
  easeIn,
  easeOut,
} from 'motion/react'

const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.25, ease: easeIn },
  },
}

const AnimatedOutletInner = forwardRef<HTMLDivElement>((_, ref) => {
  const RouterContext = getRouterContext()
  const routerContext = useContext(RouterContext)
  const renderedContext = useRef(routerContext)
  const isPresent = useIsPresent()

  if (isPresent) {
    try {
      renderedContext.current = structuredClone(routerContext)
    } catch {
      renderedContext.current = routerContext
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <RouterContext.Provider value={renderedContext.current}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  )
})
AnimatedOutletInner.displayName = 'AnimatedOutletInner'

export function AnimatedOutlet() {
  const matches = useMatches()
  const match = useMatch({ strict: false })
  const nextMatch = matches[matches.findIndex((d) => d.id === match.id) + 1]
  return (
    <AnimatePresence mode="wait">
      <AnimatedOutletInner key={nextMatch?.id} />
    </AnimatePresence>
  )
}
