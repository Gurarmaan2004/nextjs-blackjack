import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const cookieStore = cookies();  
  const response = NextResponse.json({}); // Start with JSON response
  const supabase = createClient(cookieStore, response);

  // @ts-ignore
  let guestId = cookieStore.get("guestId")?.value;

  if (!guestId) {
    guestId = crypto.randomUUID();

    response.cookies.set("guestId", guestId, {
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

  // ✅ Attach guestId to response and return it
  return NextResponse.json({ guestId }, { headers: response.headers });
}
