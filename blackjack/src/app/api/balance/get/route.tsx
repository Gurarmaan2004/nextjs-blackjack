// src/app/api/test-db/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 🔹 Parse userId from body
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 });
  }

  // 🔹 Query User by ID
  const { data, error } = await supabase
    .from('User')
    .select('chips')
    .eq('id', userId)  // Filter by user ID
    .maybeSingle();         // Expect a single record

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // 🔹 Return the chips value
  return NextResponse.json({ success: true, chips: data!.chips });
}