import { useState } from 'react'
import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { supabase } from '@/lib/supabase/client'
import { useSubmitContact } from '@/hooks/useContact'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconCircleCheck, IconLoader, IconMailFast } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const validator = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Invalid email address' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' }),
  website: z.string().max(0, { message: '' }).optional(), // honeypot — must be empty
})

type FormData = z.infer<typeof validator>

export const ContactForm = () => {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(validator),
    defaultValues: { name: '', email: '', message: '', website: '' },
  })

  const { mutateAsync: submitContact } = useSubmitContact()

  const handleSuccessSubmit = async (data: FormData) => {
    const { name, email, message, website } = data

    // Honeypot frontend check — silently succeed, don't expose rejection
    if (website) {
      setStatus('success')
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    try {
      // 1. Store in Supabase DB first
      await submitContact({ name, email, message })

      // 2. Send email notification via Edge Function
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message, website },
      })
      if (error) throw error

      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage(
        'Something went wrong. Please try again or email me directly.'
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-card mx-auto flex w-full flex-col items-center gap-4 rounded-lg px-4 py-16 text-center lg:w-xl lg:px-8">
        <IconCircleCheck size={48} className="text-indigo-500" />
        <p className="text-card-foreground text-xl font-semibold">
          Message sent!
        </p>
        <p className="text-muted-foreground">Thanks! I'll be in touch soon.</p>
      </div>
    )
  }

  return (
    <article className="bg-card mx-auto w-full rounded-lg px-4 py-8 lg:w-xl lg:px-8 lg:py-16">
      <Form<typeof validator>
        form={form}
        onError={() => {}}
        onSuccess={handleSuccessSubmit}
        className="flex flex-col gap-y-4"
      >
        {/* Honeypot — hidden from real users, filled by bots */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px overflow-hidden"
        >
          <input
            {...form.register('website')}
            type="text"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        <Form.TextField
          control={form.control}
          label="Name"
          name="name"
          placeholder="Your name"
        />
        <Form.TextField
          control={form.control}
          label="Email"
          name="email"
          placeholder="your@email.com"
        />
        <Form.TextField
          control={form.control}
          label="Message"
          name="message"
          type="long"
          placeholder="What's on your mind?"
        />

        <Button
          type="submit"
          disabled={status === 'loading'}
          icon={
            status === 'loading' ? (
              <IconLoader size={20} className="animate-spin" />
            ) : (
              <IconMailFast size={20} />
            )
          }
          className="justify-center font-normal"
        >
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </Button>

        {status === 'error' && errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}
      </Form>
    </article>
  )
}
