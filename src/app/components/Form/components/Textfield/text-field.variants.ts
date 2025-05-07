import { cva } from 'class-variance-authority'

export const textField = cva(
  'w-full border-2 rounded px-3 py-3 peer placeholder-transparent focus:outline-none text-xs',
  {
    variants: {
      variant: {
        default: 'border border-gray-600/50',
        error: 'border border-red-500/50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)