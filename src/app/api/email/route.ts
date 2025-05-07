import { env } from '@/lib/env'
import { Resend } from 'resend'
import { z } from 'zod'


export async function POST(request: Request) {
    const validator = z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        subject: z.string().min(1, { message: 'Subject is required' }),
        email: z.string().email({ message: 'Invalid email address' }),
        message: z.string().min(1, { message: 'Message is required' }),
    })
    try {
        const body = await request.json()
        const data = validator.parse(body)
        const { name, subject, email, message } = data

        const resend = new Resend(env.RESEND_API_KEY)

        await resend.emails.send({
            from: email,
            to: env.MY_CONTACT_EMAIL,
            subject: subject,
            html:`
                <h1>Contact Form Submission</h1>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
        })
        return Response.json({ message: 'Email sent successfully' }, { status: 200 })
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return Response.json(
                { message: 'Validation error', errors: error.errors },
                { status: 422 }
            )
        }
        return Response.json(
            { message: 'Internal server error', error: error },
            { status: 500 }
        )
    }
}