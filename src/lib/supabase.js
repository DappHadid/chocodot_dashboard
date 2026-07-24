import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Initialize with a dummy client if URL/Key are missing so the app doesn't crash on boot
// but data fetch will fail gracefully
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: { message: "Supabase not configured. Check .env" } })
          }),
          order: () => Promise.resolve({ data: [], error: { message: "Supabase not configured. Check .env" } })
        })
      })
    };
