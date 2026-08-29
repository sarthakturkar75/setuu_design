"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendPasswordResetEmail } from "@/lib/email";

export async function requestPasswordReset(email: string) {
  const serviceClient = await createServiceRoleClient();
  
  // Note: For security, we don't return whether the user exists or not
  const { data, error } = await serviceClient.auth.admin.generateLink({
    type: 'recovery',
    email,
  });

  if (data && data.properties && data.properties.action_link) {
    let actionLink = data.properties.action_link;
    // The action link usually looks like "https://[project].supabase.co/auth/v1/verify?token=...&type=recovery&redirect_to=..."
    // We want to redirect them to our custom reset-password page instead of Supabase's default behavior, or just pass the token directly to our page.
    
    // Instead of using Supabase's action link which auto-signs in, we can extract the token or just use the link if it redirects properly.
    // If we use Supabase's default, it emails them. Since we are using generateLink, we send the email manually!
    
    // Let's modify the link to point to our frontend /reset-password?token_hash=... or similar
    // Actually Supabase returns `hashed_token` or `action_link`. If we use action_link, it redirects to the site url.
    // We can just construct a link: /reset-password?token=... if we had the raw token, but Supabase doesn't return the raw token.
    // So we use action_link.
    
    await sendPasswordResetEmail(email, actionLink);
  }

  return { success: true };
}
