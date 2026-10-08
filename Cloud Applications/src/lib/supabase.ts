import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AppRecord = {
  id: string;
  name: string;
  description: string | null;
  url: string;
  icon: string;
  category: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type HealthStatus = {
  url: string;
  status: number | null;
  ok: boolean;
  latencyMs: number;
  checkedAt: string;
  error: string | null;
};
