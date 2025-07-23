'use client'

import { Button } from '@/app/components/Button/Button'
import { Form } from '@/app/components/Form/Form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Typography } from '../Typography/Typography'

interface IFormProps {
  className?: string
}

export const LoginForm = ({ className }: IFormProps) => {
  const validator = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' }),
    secret: z.string().min(1, { message: 'Secret is required' }),
  })

  const form = useForm<z.infer<typeof validator>>({
    mode: 'onBlur',
    resolver: zodResolver(validator),
    defaultValues: {
      email: '',
      password: '',
      secret: '',
    },
  })

  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', bounce: 0.6 }}
      className={`w-screen h-screen flex items-center justify-center overflow-hidden ${className}`}
    >
      <Form
        form={form}
        onError={() => {}}
        onSuccess={() => {}}
        className="flex flex-col gap-y-8 max-h-fit  bg-zinc-900 px-8 py-12 rounded-lg lg:px-8 lg:py-12 lg:w-xl shadow-2xl shadow-indigo-800/80 max-w-1/4"
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
  )
}
