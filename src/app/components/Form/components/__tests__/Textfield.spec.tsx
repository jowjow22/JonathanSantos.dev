import { zodResolver } from '@hookform/resolvers/zod'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { FormProvider, useForm, UseFormSetError } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { TextField } from '../Textfield/Textfield'

let set_error: UseFormSetError<{
  [key: string]: unknown
}>

function renderWithForm(
  props: Parameters<typeof TextField>[0],
  schema?: z.ZodSchema
) {
  const validationSchema = z.object({
    [props.name as string]: z.string().nonempty('Required'),
  })
  const Wrapper: React.FC = () => {
    const methods = useForm({
      resolver: zodResolver(schema ?? validationSchema),
      defaultValues: { [props.name as string]: '' },
      mode: 'onBlur',
    })
    set_error = methods.setError
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(() => {})}>
          <TextField {...props} control={methods.control} />
          <button type="submit">Submit</button>
        </form>
      </FormProvider>
    )
  }

  render(<Wrapper />)
}

describe('<TextField> error handling', () => {
  it('shows the error message when setError is called', async () => {
    const fieldName = 'email'
    const errorMessage = 'Email is required'

    const zodSchema = z.object({
      [fieldName]: z.string().email(errorMessage),
    })

    renderWithForm({ name: fieldName, label: 'Email' }, zodSchema)

    await act(async () => {
      set_error(fieldName, { type: 'manual', message: errorMessage })
    })

    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(errorMessage)).toBeInTheDocument()
  })

  it('validates "required" on blur and shows default FormMessage', async () => {
    const fieldName = 'username'
    renderWithForm({
      name: fieldName,
      label: 'Username',
      placeholder: 'Enter username',
    })

    const input = await screen.findByPlaceholderText('Enter username')

    await userEvent.click(input)
    await userEvent.tab()

    const submitButton = await screen.findByRole('button', { name: /submit/i })
    await userEvent.click(submitButton)
    expect(await screen.findByText(/Required/)).toBeInTheDocument()
  })
})
