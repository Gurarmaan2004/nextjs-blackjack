// components/ui/BetControls.tsx
export default function BetControls({
  bet,
  setBet,
  onPlaceBet,
}: {
  bet: number;
  setBet: React.Dispatch<React.SetStateAction<number>>;
  onPlaceBet: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      {/* Input box for bet amount */}
      <input
        type="number"
        value={bet}
        onChange={(e) => setBet(Number(e.target.value))}
        className="w-40 text-center text-white bg-black border border-gray-600 rounded py-2 px-4"
      />

      {/* Chip increment buttons */}
      <div className="flex gap-4">
        {[5, 25, 100].map((amt) => (
          <button
            key={amt}
            onClick={() => setBet((prev) => prev + amt)}
            className="w-16 h-12 text-white border border-gray-500 rounded hover:bg-gray-700"
          >
            +{amt}
          </button>
        ))}
      </div>

      {/* Place Bet button
      <button
        onClick={onPlaceBet}
        className="w-40 py-3 bg-white text-black rounded hover:bg-gray-300 transition"
      >
        Place Bet
      </button> */}
    </div>
  );
}
