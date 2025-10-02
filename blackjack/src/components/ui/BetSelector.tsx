const amounts = [5, 25, 50, 100];

export default function BetSelector({ bet, setBet }: { bet: number; setBet: (n: number) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-md">Current Bet: {bet}</p>
      <div className="flex gap-2 justify-center">
        {amounts.map((amt) => (
          <button
            key={amt}
            onClick={() => setBet(bet + amt)}
            className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
          >
            +{amt}
          </button>
        ))}
      </div>
      <button onClick={() => setBet(0)} className="text-sm text-red-400 underline mt-2">
        Reset
      </button>
    </div>
  );
}
