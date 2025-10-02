const { PrismaClient } = require('../src/generated/prisma'); // ✅ correct path
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      chips: 500,
    },
  });

  await prisma.game.create({
    data: {
      userId: user.id,
      bet: 100,
      userScore: 18,
      dealerScore: 20,
      result: 'Lose',
      finalState: {},
    },
  });

  await prisma.chipTransaction.create({
    data: {
      userId: user.id,
      delta: -100,
      reason: 'Initial bet',
    },
  });

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
