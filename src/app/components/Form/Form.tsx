import { ZodSchema } from 'zod'

interface IFormProps<T> {
  validator: ZodSchema
  onSuccess: (_data: T) => void
  onError: (_error: unknown) => void
  children?: React.ReactNode
}

export const Form = <T,>({
  validator,
  onSuccess,
  onError,
  children,
}: IFormProps<T>) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const result = validator.safeParse(data)

    if (result.success) {
      onSuccess(result.data)
    } else {
      onError(result.error.format())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      {children}
    </form>
  )
}
