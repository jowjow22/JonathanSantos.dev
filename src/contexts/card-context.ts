import { createContext } from 'react'

export const CardContext = createContext({
  variant: 'default' as 'default' | 'image_background',
})
