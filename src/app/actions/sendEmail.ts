"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Oasis Wellness Contact Form <info@contact.oasiswellnessconsultancy.com>',
      to: ['maryathat@gmail.com'],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    if (error) {
      return { error: error.message };
    }
    console.log(data)

    return { success: true };
  } catch (error: any) {
    return { error: error.message || 'Failed to send email' };
  }
}
