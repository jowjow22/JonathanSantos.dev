const Typography = () => {}

const H1 = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h1
      className={`text-3xl font-bold text-zinc-200 font-poppins lg:text-6xl md:text-5xl ${className}`}
    >
      {children}
    </h1>
  )
}

const H2 = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h2
      className={`text-xl font-bold text-zinc-200 font-poppins lg:text-5xl ${className}`}
    >
      {children}
    </h2>
  )
}

const H3 = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <h3
      className={`text-xl font-bold text-zinc-200 font-poppins lg:text-3xl ${className}`}
    >
      {children}
    </h3>
  )
}

const Paragraph = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <p className={`text-sm text-zinc-200 font-inter lg:text-base ${className}`}>
      {children}
    </p>
  )
}

Typography.H1 = H1
Typography.H2 = H2
Typography.H3 = H3
Typography.Paragraph = Paragraph

export { Typography }
