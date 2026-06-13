import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://evegeujazcbweapgyilt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2ZWdldWphemNid2VhcGd5aWx0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwODY2ODIsImV4cCI6MjA5NjY2MjY4Mn0.cfrrmYSZY5ghXPGETQjBK-_2k_UyY-yu4TBagBumv1U'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)