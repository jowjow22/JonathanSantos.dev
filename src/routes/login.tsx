import { Button } from '@/components/Button/Button'
import { Form } from '@/components/Form/Form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Typography } from '@/components/Typography/Typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
})

export default function Login() {
  const validator = z.object({
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    secret: z.string().min(1, { message: 'Secret is required' }),
  })

  type FormData = z.infer<typeof validator>

  const form = useForm<FormData>({
    mode: 'onBlur',
    resolver: zodResolver(validator),
    defaultValues: {
      email: '',
      password: '',
      secret: '',
    },
  })

  return (
    <div className="overflow-hidden bg-[url(/image-mesh-gradient.png)]">
      <motion.article
        animate={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 10 }}
        transition={{ type: 'spring', bounce: 0.6 }}
        className={`flex h-screen w-screen items-center justify-center overflow-hidden`}
      >
        <Form<typeof validator>
          form={form}
          onError={() => {}}
          onSuccess={() => {}}
          className="flex max-h-fit max-w-1/4 flex-col gap-y-8 rounded-lg bg-zinc-900 px-8 py-12 shadow-2xl shadow-indigo-800/80 lg:w-xl lg:px-8 lg:py-12"
        >
          <Typography.H2 className="text-center">
            Enter with Credentials
          </Typography.H2>
          <div className="flex flex-col gap-y-4">
            <Form.TextField
              control={form.control}
              label="Email"
              name="email"
              placeholder="login@jonathansantos.dev"
            />
            <Form.TextField
              control={form.control}
              label="Password"
              name="password"
              placeholder="*********"
            />
            <Form.TextField
              control={form.control}
              label="Secret"
              name="secret"
              placeholder="**********"
            />
          </div>
          <Button type="submit" className="justify-center font-normal">
            Acess
          </Button>
        </Form>
      </motion.article>
    </div>
  )
}
