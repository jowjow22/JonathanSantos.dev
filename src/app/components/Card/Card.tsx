import * as motion from 'motion/react-client'
import Image from 'next/image'

const CardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <header
      className={`flex items-center justify-self-start! justify-end w-full ${className}`}
    >
      {children}
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
  return (
    <section
      className={`max-w-full flex flex-col gap-y-4 row-start-5 row-end-8 justify-center ${className}`}
    >
      <div>{children}</div>
    </section>
  )
}

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.article
      className="relative rounded-xl min-w-80 h-72 group overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        duration: 0.2,
      }}
    >
      <Image
        src="/sample-project.png"
        alt="Project Title"
        fill
        sizes="100%"
        className="relative! object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute bg-linear-to-t from-black/80 to-transparent text-white p-4 h-full bottom-0 min-w-full max-w-full grid grid-cols-1 grid-rows-8">
        {children}
      </div>
    </motion.article>
  )
}

Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter
