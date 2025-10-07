// src/app/api/user/guest/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const cookieStore = await cookies();
  let guestId = cookieStore.get("guestId")?.value;
  const supabase = createClient(cookieStore);

  if (!guestId) {
    guestId = crypto.randomUUID();
    cookieStore.set("guestId", guestId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    const { error } = await supabase.from("User").insert({
      id: guestId,
      chips: 250,
    });

    if (error) {
      console.error("Failed to create guest user:", error);
      return NextResponse.json({ error: "Could not create guest" }, { status: 500 });
    }
  }

  return NextResponse.json({ guestId });
}
