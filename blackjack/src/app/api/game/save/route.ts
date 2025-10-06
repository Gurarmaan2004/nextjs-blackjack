console.log("🧪 DATABASE_URL:"); // Add this here


import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  const { userId, bet, result, userScore, dealerScore, finalState } = await req.json();

  const game = await prisma.game.create({
    data: {
      userId,
      bet,
      result,
      userScore,
      dealerScore,
      finalState, // pass an object with full round state if needed
    },
  });

  return NextResponse.json({ success: true, game });
}
