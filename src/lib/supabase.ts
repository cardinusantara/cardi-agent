import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  (typeof import.meta !== 'undefined' && (import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL)) ||
  (typeof process !== 'undefined' ? process.env?.PUBLIC_SUPABASE_URL?.trim() || process.env?.NEXT_PUBLIC_SUPABASE_URL?.trim() : '') ||
  '';

const supabaseKey =
  (typeof import.meta !== 'undefined' && (import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY)) ||
  (typeof process !== 'undefined' ? process.env?.SUPABASE_SERVICE_ROLE_KEY?.trim() || process.env?.PUBLIC_SUPABASE_ANON_KEY?.trim() : '') ||
  '';

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase Config Warning] Variabel PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL atau PUBLIC_SUPABASE_ANON_KEY/SUPABASE_SERVICE_ROLE_KEY belum terisi dengan benar di .env.local'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder',
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
