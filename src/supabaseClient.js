import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jtppruvfwdbgbmztkbsb.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0cHBydXZmd2RiZ2JtenRrYnNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MjI1MDMsImV4cCI6MjA5MzI5ODUwM30.0MYttc1TQfBsrBUhddtF0ZMGlfzWRSZ1-YFAUl7q32s"

export const supabase = createClient(supabaseUrl, supabaseKey)
