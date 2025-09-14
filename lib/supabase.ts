import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type FreelancerProfile = {
  id: string;
  user_id: string;
  wallet_address: string;
  title: string;
  bio: string;
  profile_picture: string | null;
  category: string;
  specialities: string[];
  skills: string[];
  english_fluency: string;
  rate: number;
  date_of_birth: string;
  country: string;
  address: string;
  state: string;
  city: string;
  phone: string;
  zipcode: number;
  created_at: string;
  updated_at: string;
};
