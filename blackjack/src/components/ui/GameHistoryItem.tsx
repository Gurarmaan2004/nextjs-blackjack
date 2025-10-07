interface GameRecord {
  date: string;
  bet: number;
  playerScore: number;
  dealerScore: number;
  result: string;
  payout: number;
}

export default function GameHistoryItem({ game }: { game: GameRecord }) {
  const resultColor =
    game.result.includes("Win") || game.result.includes("Blackjack")
      ? "text-green-400"
      : "text-red-400";

  return (
    <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs mb-1">Date</p>
          <p className="text-gray-800 dark:text-gray-200">{game.date}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs mb-1">Bet</p>
          <p className="text-gray-800 dark:text-gray-200">{game.bet} chips</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs mb-1">Score</p>
          <p className="text-gray-800 dark:text-gray-200">
            You: {game.playerScore} | Dealer: {game.dealerScore}
          </p>
        </div>
        <div>
            <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase text-xs mb-1">Result</p>
            <p className={`font-semibold ${resultColor}`}>
                {game.result}
                {game.payout !== 0 && (
                <span className={
                    game.result === "Push"
                    ? "text-red-400 dark:text-yellow-300"
                    : game.payout > 0
                    ? "text-green-400 dark:text-green-300"
                    : "text-red-400 dark:text-red-300"
                }>
                    {` (${game.payout > 0 ? '+' : ''}${game.payout})`}
                </span>
                )}
            </p>
            </div>
      </div>
    </div>
  );
}
