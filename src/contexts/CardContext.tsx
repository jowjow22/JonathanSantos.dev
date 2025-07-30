import { useMemo } from 'react'
import { CardContext } from './card-context'

export default function CardContextProvider({
  children,
  variant,
}: Readonly<{
  children: React.ReactNode
  variant: 'default' | 'image_background'
}>) {
  const value = useMemo(() => ({ variant }), [variant])
  return <CardContext.Provider value={value}>{children}</CardContext.Provider>
}
