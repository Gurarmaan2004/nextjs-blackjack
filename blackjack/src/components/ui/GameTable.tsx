// components/GameTable.tsx
export default function GameTable({
  dealerCards,
  playerCards,
  status
}: {
  dealerCards: string[];
  playerCards: string[];
  status: string;
}) {
  return (
    <div className="text-white text-center mt-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Dealer</h2>
        <div className="flex justify-center gap-2">
          {dealerCards.map((card, i) => (
            <div key={i} className="bg-gray-800 p-3 rounded border">{card}</div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold">Player</h2>
        <div className="flex justify-center gap-2">
          {playerCards.map((card, i) => (
            <div key={i} className="bg-blue-800 p-3 rounded border">{card}</div>
          ))}
        </div>
      </div>
      {status && <div className="text-xl font-bold mt-4">{status}</div>}
    </div>
  );
}
