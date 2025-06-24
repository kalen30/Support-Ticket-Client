/**
 * Initializes and exports a Supabase client instance.
 * This client is used to interact with the Supabase backend throughout the application.
 *
 * @author Kalen Cha
 * @version 1.0.0
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_URL
const supabaseAnonKey = import.meta.env.VITE_ANON

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
