'use client'

import CardContextProvider, { CardContext } from '@/app/contexts/CardContext'
import * as motion from 'motion/react-client'
import Image from 'next/image'
import React, { useContext } from 'react'
import { cardVariantSchema } from './card.schema'
import {
  cardContainer as cardContainerVariants,
  cardContent,
  cardHeader as cardHeaderVariants,
  card as cardVariants,
} from './card.variants'

const CardHeader = ({
  children,
  className,
  image,
}: {
  children: React.ReactNode
  className?: string
  image?: {
    src: string
    alt: string
  }
}) => {
  const { variant } = useContext(CardContext)
  const cardVariant = cardVariantSchema.parse(variant)
  const currentVariant = cardHeaderVariants({ variant: cardVariant })
  return (
    <header className={`${currentVariant} ${className}`}>
      {variant === 'default' && (
        <>
          <Image
            src={image?.src ?? '/sample-project.png'}
            alt={image?.alt ?? 'Card image'}
            fill
            style={{ borderRadius: '0.5rem' }}
            sizes="100%"
            className="relative! object-cover transition-transform duration-500 ease-in-out group-hover:scale-103 overflow-hidden"
          />
          <div className="absolute rounded-lg transition-transform duration-500 ease-in-out top-0 right-0 bg-linear-to-b to-transparent to-100% from-black/80 from-70% w-full h-full flex items-start justify-end p-3 group-hover:scale-103">
            {children}
          </div>
        </>
      )}
      {variant === 'image_background' && children}
    </header>
  )
}

const CardFooter = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <footer
      className={`flex gap-x-4 row-start-8 row-end-8 items-center ${className}`}
    >
      {children}
    </footer>
  )
}

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { variant } = useContext(CardContext)
  const cardVariant = cardVariantSchema.parse(variant)
  const currentVariant = cardContent({ variant: cardVariant })
  return (
    <section className={`${currentVariant} ${className}`}>
      <div>{children}</div>
    </section>
  )
}

export const Card = ({
  children,
  variant,
}: {
  children: React.ReactNode
  variant?: 'default' | 'image_background'
}) => {
  const currentVariant = cardVariants({ variant })
  const cardContainerVariant = cardContainerVariants({ variant })

  return (
    <motion.article
      className={cardContainerVariant}
      whileHover={{ scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        duration: 0.2,
      }}
    >
      {variant === 'image_background' && (
        <Image
          src="/sample-project.png"
          alt="Project Title"
          fill
          sizes="100%"
          className="relative! object-cover max-h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
      )}
      <div className={currentVariant}>
        <CardContextProvider variant={variant ?? 'default'}>
          {children}
        </CardContextProvider>
      </div>
    </motion.article>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter
