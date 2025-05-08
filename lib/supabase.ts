import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://snsgjhzeivhsdpmmevtp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuc2dqaHplaXZoc2RwbW1ldnRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MTExODAsImV4cCI6MjA2MjA4NzE4MH0.nBmMXEW_2LIzmDM45dFQVCgHY3MpwJgNtGr_2PwQekw'
)
