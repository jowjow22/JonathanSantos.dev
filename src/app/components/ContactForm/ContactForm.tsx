'use client'

import { Button } from '@/app/components/Button/Button'
import { Form } from '@/app/components/Form/Form'
import { Typography } from '@/app/components/Typography/Typography'
import { IconMailFast } from '@tabler/icons-react'
import { z } from 'zod'

type FormData = {
  name: string;
  email: string;
  message: string;
}

export const ContactForm = () => {
  const validator = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    message: z.string().min(1, { message: 'Message is required' }),
  })

  const handleSubmit = (_data: FormData) => {
    // TODO: Implement form submission logic
  }

  const handleError = (error: unknown) => {
    alert(`Error: ${  error}`)
  }

  return (
    <article className="w-full bg-zinc-900 flex flex-col justify-center text-center px-4 py-8 rounded-lg">
      <Typography.H1 className="font-thin mb-5">Contact me!</Typography.H1>
      <Typography.Paragraph className="font-thin">
        Send me an email and we can schedule a meeting, and maybe work
        together!!
      </Typography.Paragraph>
      <div className="h-68 bg-white">
        <Form
          validator={validator}
          onError={handleError}
          onSuccess={handleSubmit}
        >
          <Form.TextField label="Name" name="name" />
          <Form.TextField label="Email" name="email" />
          <Form.TextField label="Message" name="message" long />
          <Button
            type="submit"
            icon={<IconMailFast size={30} />}
            className="justify-center font-normal"
          >
            Send
          </Button>
        </Form>
      </div>
    </article>
  )
}