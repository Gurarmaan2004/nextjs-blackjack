// src/app/api/test-db/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, delta, reason } = await req.json();
  const cookieStore = await cookies(); // ✅ await it

  const supabase = createClient(cookieStore);
  
  const newData = {
      chips: { increment: delta },
      chipTransactions: {
        create: { delta, reason }
      }
    }
  const { data, error } = await supabase
        .from('User') // Replace 'your_table_name' with your actual table name
        .update(newData)
        .eq('id', userId);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

