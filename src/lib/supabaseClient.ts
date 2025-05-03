import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log(supabaseUrl, supabaseAnonKey); // Debugging line to check if the keys are being loaded correctly

export const supabase = createClient(supabaseUrl, supabaseAnonKey);