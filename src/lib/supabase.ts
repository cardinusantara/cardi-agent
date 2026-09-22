import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    '[Supabase Config Warning] Variabel NEXT_PUBLIC_SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum terisi dengan benar di .env.local'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRoleKey || 'placeholder',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export interface Card {
  id?: string;
  card_id: string;
  business_name: string | null;
  place_id: string | null;
  review_url: string | null;
  google_review_url?: string | null;
  pin_hash: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
