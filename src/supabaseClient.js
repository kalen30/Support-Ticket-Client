/**
 * Initializes and exports a Supabase client instance.
 * This client is used to interact with the Supabase backend throughout the application.
 *
 * @author Kalen Cha
 * @version 1.0.0
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://utuiturpazgxejaqqdkv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0dWl0dXJwYXpneGVqYXFxZGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0NjU3NzAsImV4cCI6MjA2NjA0MTc3MH0.wIsPpy1RQqtB3yyzO30pry2AxhE30oocrMUzKe7FbN8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
