import { useState } from 'react'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '@/lib/supabase/client'
import { Form } from '@/components/Form/Form'
import { Button } from '@/components/Button/Button'

const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Route = createFileRoute('/admin/login')({
  beforeLoad: ({ context }) => {
    // Redirect already-authenticated admins away from login page
    if (context.auth.isLoading) return
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/admin/dashboard' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormData>({
    mode: 'onBlur',
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    setIsSubmitting(false)

    if (error) {
      form.setError('root', { message: 'Invalid email or password' })
      return
    }

    navigate({ to: '/admin/dashboard' })
  }

  return (
    <div className="bg-background flex h-screen w-screen items-center justify-center px-4">
      <Form<typeof loginSchema>
        form={form}
        onError={() => {}}
        onSuccess={handleLogin}
        className="bg-card flex w-full max-w-sm flex-col gap-y-6 rounded-lg border px-8 py-10 shadow-lg"
      >
        <h1 className="text-center text-xl font-semibold">Admin Login</h1>
        <div className="flex flex-col gap-y-4">
          <Form.TextField
            control={form.control}
            label="Email"
            name="email"
            placeholder="admin@jonathansantos.dev"
          />
          <Form.TextField
            control={form.control}
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
          />
        </div>
        {form.formState.errors.root && (
          <p className="text-destructive text-center text-sm">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          className="w-full justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </Form>
    </div>
  )
}
