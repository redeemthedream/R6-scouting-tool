import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xyqdjcdhobuktdlilmvj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5cWRqY2Rob2J1a3RkbGlsbXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDY4ODAsImV4cCI6MjA4NDA4Mjg4MH0.fPQUNHB2tqhu8-kzK2O9Z30wyT2JxysIvl45PWgf4l4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
