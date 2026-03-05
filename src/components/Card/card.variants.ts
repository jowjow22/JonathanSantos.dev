import { cva } from 'class-variance-authority'

export const card = cva(
  'absolute text-card-foreground p-4 bottom-0 min-w-full max-w-full ',
  {
    variants: {
      variant: {
        default: 'bg-card h-82 flex flex-col gap-y-4',
        image_background:
          'text-white bg-linear-to-t from-black/80 to-transparent h-62 xl:h-72 grid grid-cols-1 grid-rows-8',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export const cardContainer = cva(
  'relative rounded-xl min-w-80 md:min-w-70 lg:min-w-80 group overflow-hidden',
  {
    variants: {
      variant: {
        default: 'h-82',
        image_background: 'h-62 xl:h-72',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export const cardHeader = cva('justify-self-start! w-full', {
  variants: {
    variant: {
      default: 'relative rounded-lg flex-1',
      image_background: 'flex items-center justify-end',
    },
    defaultVariants: {
      variant: 'default',
    },
  },
})

export const cardContent = cva(
  'max-w-full flex flex-col gap-y-4 justify-center',
  {
    variants: {
      variant: {
        default: 'row-start-5 row-end-6 flex-1',
        image_background: 'row-start-5 row-end-8',
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  }
)
