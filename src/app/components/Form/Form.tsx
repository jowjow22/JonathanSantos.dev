'use client'

import { createContext } from 'react'
import { ZodSchema } from 'zod'
import { TextField } from './components/Textfield/Textfield'
interface IFormProps<T> {
  validator: ZodSchema
  onSuccess?: (_data: T) => void
  onError?: (_error: unknown) => void
  children?: React.ReactNode
}

export const FormContext = createContext({})
export const FormProvider = FormContext.Provider

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

    if(onSuccess && result.success) {
      onSuccess(result.data as T)
    }
    if(onError && !result.success) {
      onError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
      <FormProvider value={{ validator, onSuccess, onError }}>
        {children}
      </FormProvider>
    </form>
  )
}


Form.TextField = TextField