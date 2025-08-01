import { Form as ShadCnForm } from '@/components/ui/form'
import React from 'react'
import {
  type UseFormReturn,
  type FieldErrors,
  type FieldValues,
} from 'react-hook-form'
import { z, ZodType } from 'zod'
import { TextField } from './components/Textfield/Textfield'

interface IFormProps<T extends ZodType<FieldValues>> {
  form: UseFormReturn<z.infer<T>>
  onSuccess: (_data: z.infer<T>) => void
  onError: (_errors: FieldErrors<z.infer<T>>) => void
  className?: string
  children: React.ReactNode
}

export const Form = <T extends ZodType<FieldValues>>({
  form,
  children,
  onSuccess,
  onError,
  className,
}: IFormProps<T>) => {
  return (
    <ShadCnForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSuccess, onError)}
        className={className}
      >
        {children}
      </form>
    </ShadCnForm>
  )
}

Form.TextField = TextField
