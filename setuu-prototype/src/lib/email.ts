import { Resend } from 'resend';

// The user provided this key directly
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendInviteEmail(email: string, inviterName: string, roleOffered: string, targetName: string, inviteUrl: string) {
  try {
    const data = await resend.emails.send({
      from: 'Setuu <onboarding@resend.dev>', // resend.dev is the default sandbox domain
      to: email,
      subject: `You have been invited to join ${targetName} on Setuu`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Setuu</h2>
          <p>Hi there,</p>
          <p><strong>${inviterName}</strong> has invited you to join <strong>${targetName}</strong> as a <strong>${roleOffered}</strong> on the Setuu platform.</p>
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Accept Invitation</a>
          </div>
          <p style="color: #666; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${inviteUrl}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="color: #999; font-size: 12px;">This invitation will expire in 7 days.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send invite email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  try {
    const data = await resend.emails.send({
      from: 'Setuu Security <onboarding@resend.dev>',
      to: email,
      subject: `Reset your Setuu password`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hi there,</p>
          <p>We received a request to reset your password for your Setuu account. Click the button below to choose a new password.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send reset email:', error);
    return { success: false, error };
  }
}
