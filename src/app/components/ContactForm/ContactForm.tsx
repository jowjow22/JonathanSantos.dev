'use client'

import { Button } from '@/app/components/Button/Button'
import { Form } from '@/app/components/Form/Form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconMailFast } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const ContactForm = () => {
  const validator = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    subject: z.string().min(1, { message: 'Subject is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    message: z.string().min(1, { message: 'Message is required' }),
  })

  const form = useForm<z.infer<typeof validator>>({
    mode: 'onBlur',
    resolver: zodResolver(validator),
    defaultValues: {
      name: '',
      subject: '',
      email: '',
      message: '',
    },
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
      return
    }
  }

  return (
    <article className="w-full bg-zinc-900 px-4 py-8 rounded-lg lg:px-8 lg:py-16 lg:w-xl">
      <Form
        form={form}
        onError={() => {}}
        onSuccess={handleSuccessSubmit}
        className="flex flex-col gap-y-4"
      >
        <Form.TextField
          control={form.control}
          label="Name"
          name="name"
          placeholder="A pretty name"
        />
        <Form.TextField
          control={form.control}
          label="Subject"
          name="subject"
          placeholder="Contact"
        />
        <Form.TextField
          control={form.control}
          label="Email"
          name="email"
          placeholder="jhondoe@mail.com"
        />
        <Form.TextField
          control={form.control}
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
