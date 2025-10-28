import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Wedding = {
  id: string;
  user_id: string;
  couple_names: string;
  wedding_date: string;
  venue: string;
  guest_count: number;
  budget: number | null;
  theme: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
