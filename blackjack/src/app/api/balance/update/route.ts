// src/app/api/test-db/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, newBalance, reason } = await req.json();
  console.log(newBalance, "new balance")
  const cookieStore = await cookies(); // ✅ await it

  const supabase = createClient(cookieStore);
  
//   const newData = {
//       chips: { increment: delta }
//     }
    const { error: updateError } = await supabase
    .from("User")
    .update({ chips: newBalance })
    .eq("id", userId);

    if (updateError) {
    return NextResponse.json({ success: false, error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, newBalance });
}

