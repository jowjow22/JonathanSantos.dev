import { createContext } from 'react'

type CardContextType = {
  variant: 'default' | 'image_background'
}

export const CardContext = createContext<CardContextType | undefined>(undefined)
