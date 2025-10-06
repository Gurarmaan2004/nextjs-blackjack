// src/app/api/test-db/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies(); // ✅ await it

  const supabase = createClient(cookieStore);

  const { data: users, error } = await supabase.from('User').select('*').limit(1);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, users });
}
