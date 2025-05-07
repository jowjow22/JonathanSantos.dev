import { env } from '@/lib/env'
import nodemailer from 'nodemailer'
import { z } from 'zod'


async function sendEmail(
    name: string,
    subject: string,
    email: string,
    message: string
) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: env.MY_CONTACT_EMAIL,
            clientId:   env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            refreshToken: env.GOOGLE_REFRESH_TOKEN,
        },
    })

    return await transporter.sendMail({
        from: `${name} <${email}>`,
        to: env.MY_CONTACT_EMAIL,
        subject: subject,
        html: `
            <h1>Contact Form</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
        
    })
}
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

        const info = await sendEmail(
            name,
            subject,
            email,
            message
        )

      
        return Response.json(
            { message: 'Email sent successfully', data: info },
            { status: 200 }
        )
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