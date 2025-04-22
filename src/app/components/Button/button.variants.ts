import { cva } from 'class-variance-authority'

export const button = cva(
  `px-4 py-2 min-x-[64px] rounded font-bold cursor-pointer font-poppins transition-colors duration-200 flex flex-row items-center gap-x-2 whitespace-nowrap`,
  {
    variants: {
      variant: {
        primary: 'bg-indigo-800 text-white',
        secondary:
          'bg-transparent text-white border-2 border-solid border-gray-600/50',
      },
      disabled: {
        false: null,
        true: 'cursor-not-allowed! opacity-50',
      },
      onlyIcon: {
        false: null,
        true: 'px-2! py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      disabled: false,
      onlyIcon: false,
    },
    compoundVariants: [
      {
        variant: 'primary',
        disabled: false,
        className: 'hover:bg-indigo-900 active:bg-indigo-700',
      },
      {
        variant: 'secondary',
        disabled: false,
        className: 'hover:bg-zinc-600/50 active:bg-zinc-500/50',
      },
    ],
  }
)