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
        className="w-40 text-center text-black dark:text-white bg-white dark:bg-black border border-gray-400 dark:border-gray-600 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />

      {/* Chip increment buttons */}
      <div className="flex gap-4">
        {[5, 25, 100].map((amt) => (
          <button
            key={amt}
            onClick={() => setBet((prev) => prev + amt)}
            className="w-16 h-12 font-semibold text-black dark:text-white bg-gray-200 dark:bg-gray-800 border border-gray-400 dark:border-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
          >
            +{amt}
          </button>
        ))}
      </div>

      {/* Place Bet button */}
      {/* <button
        onClick={onPlaceBet}
        className="w-40 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
      >
        Place Bet
      </button> */}
    </div>
  );
}
