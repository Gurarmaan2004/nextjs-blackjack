// src/app/api/game/save/route.ts
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userId, bet, result, userScore, dealerScore } = await req.json();
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('Game')
    .insert([
      {
        userId,
        bet,
        result,
        userScore,
        dealerScore,
      },
    ])
    .select();

  if (error) {
    console.error("Supabase insert error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, game: data[0] });
}
