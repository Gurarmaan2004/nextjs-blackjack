import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { userId, delta, reason } = await req.json();

  // Update chips
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      chips: { increment: delta },
      chipTransactions: {
        create: { delta, reason }
      }
    },
  });

  return NextResponse.json({ newBalance: user.chips });
}
