import { cva } from 'class-variance-authority'

export const card = cva(
  'absolute  text-white p-4 h-full bottom-0 min-w-full max-w-full grid grid-cols-1 grid-rows-8',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900',
        image_background: 'bg-linear-to-t from-black/80 to-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export const cardContainer = cva('relative rounded-xl min-w-80 group overflow-hidden', {
    variants: {
        variant: {
        default: 'h-82',
        image_background: 'h-72',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
})
    

export const cardHeader = cva('justify-self-start! w-full', {
  variants: {
    variant: {
      default: 'relative row-start-1 row-end-5 overflow-hidden rounded-lg',
      image_background: 'flex items-center justify-end',
    },
    defaultVariants: {
      variant: 'default',
    },
  },
})
