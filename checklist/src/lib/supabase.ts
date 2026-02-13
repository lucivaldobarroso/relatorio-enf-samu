import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ohpuagmaoezgcucosoai.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocHVhZ21hb2V6Z2N1Y29zb2FpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTg4MzAsImV4cCI6MjA4NjQ5NDgzMH0.wmfUuBHVAw_jptNNjHh5Rma1ps8aFB5AJ2GqSBIsVYA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
