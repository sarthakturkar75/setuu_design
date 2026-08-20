import { createClient } from '@supabase/supabase-js'

// Note: This client bypasses RLS. Never use it in the browser or expose it to the client.
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
