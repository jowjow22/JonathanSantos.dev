'use client'

import { Button } from '@/app/components/Button/Button'
import { Form } from '@/app/components/Form/Form'
import { Typography } from '@/app/components/Typography/Typography'
import { IconMailFast } from '@tabler/icons-react'
import { z } from 'zod'

export const ContactForm = () => {
  const validator = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    subject: z.string().min(1, { message: 'Subject is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    message: z.string().min(1, { message: 'Message is required' }),
  })

  const handleSuccessSubmit = async (data: z.infer<typeof validator>) => {
    const { name, subject, email, message } = data
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, subject, email, message }),
    })
    if (!response.ok) {
      const error = await response.json()
      console.error('Error sending email:', error)
      return
    }
  }

  return (
    <article className="w-full bg-zinc-900 flex flex-col justify-center text-center px-4 py-8 rounded-lg lg:px-8 lg:py-16 lg:w-xl">
      <Typography.H1 className="font-thin mb-5 lg:hidden">
        Contact me!
      </Typography.H1>
      <Typography.H2 className="font-thin mb-5 hidden lg:block">
        Contact me!
      </Typography.H2>
      <Typography.Paragraph className="font-thin lg:hidden">
        Send me an email and we can schedule a meeting, and maybe work
        together!!
      </Typography.Paragraph>
      <Form
        validator={validator}
        onError={() => {}}
        onSuccess={handleSuccessSubmit}
      >
        <Form.TextField label="Name" name="name" placeholder="A pretty name" />
        <Form.TextField label="Subject" name="subject" placeholder="Contact" />
        <Form.TextField
          label="Email"
          name="email"
          placeholder="jhondoe@mail.com"
        />
        <Form.TextField
          label="Message"
          name="message"
          type="long"
          placeholder="Hi!"
        />
        <Button
          type="submit"
          icon={<IconMailFast size={30} />}
          className="justify-center font-normal"
        >
          Send
        </Button>
      </Form>
    </article>
  )
}
