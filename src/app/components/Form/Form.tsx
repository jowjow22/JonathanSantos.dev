'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { ZodType, z } from 'zod'
import { TextField } from './components/Textfield/Textfield'
interface IFormProps<T extends ZodType> {
  validator: T
  onSuccess: SubmitHandler<z.infer<T>>
  onError?: (_error: unknown) => void
  children?: React.ReactNode
}

export const Form = <T extends ZodType>({
  validator,
  onSuccess,
  onError,
  children,
}: IFormProps<T>) => {
  const methods = useForm({
    resolver: zodResolver(validator),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSuccess, onError)}
        className="flex flex-col gap-y-4"
      >
        {React.Children.map(children, (child) => {
          const childrenType = child as {
            props: { name: string; error?: boolean; errorMessage?: string }
          }
          if (
            React.isValidElement(child) &&
            typeof childrenType.props.name === 'string'
          ) {
            return React.cloneElement(child, {
              ...childrenType.props,
              ...register(childrenType.props.name),
              error: Boolean(errors[childrenType.props.name]),
              errorMessage: errors[childrenType.props.name]?.message,
            } as typeof childrenType.props)
          }
          return child
        })}
      </form>
    </FormProvider>
  )
}

Form.TextField = TextField
