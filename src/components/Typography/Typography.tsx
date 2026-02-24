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
      className={`font-poppins text-foreground text-3xl font-bold md:text-5xl lg:text-6xl ${className}`}
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
      className={`font-poppins text-foreground text-3xl font-bold lg:text-5xl ${className}`}
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
      className={`font-poppins text-foreground text-xl font-bold lg:text-3xl ${className}`}
    >
      {children}
    </h3>
  )
}

const H4 = ({
  children,
  className,
  dataTestId,
}: {
  children: React.ReactNode
  className?: string
  dataTestId?: string
}) => {
  return (
    <h4
      className={`font-poppins text-foreground text-lg font-bold lg:text-xl ${className}`}
      data-testid={dataTestId}
    >
      {children}
    </h4>
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
    <p
      className={`font-inter text-foreground text-sm lg:text-base ${className}`}
    >
      {children}
    </p>
  )
}

Typography.H1 = H1
Typography.H2 = H2
Typography.H3 = H3
Typography.H4 = H4
Typography.Paragraph = Paragraph

export { Typography }
