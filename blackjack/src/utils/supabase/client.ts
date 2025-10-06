// src/utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import type { cookies as CookiesType } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

export const createClient = (cookieStore: Awaited<ReturnType<typeof CookiesType>>) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Safe to ignore if you're not writing cookies here
          }
        },
      },
    }
  );
};
