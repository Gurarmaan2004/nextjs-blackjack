interface GameRecord {
  date: string;
  bet: number;
  playerScore: number;
  dealerScore: number;
  result: string;
  payout: number
}

export default function GameHistoryItem({ game }: { game: GameRecord }) {
  const resultColor = game.result.includes('Win') || game.result.includes('Blackjack')
    ? 'text-green-400'
    : 'text-red-400';

  return (
    <div className="flex justify-between items-center bg-black border border-gray-700 p-4 rounded-lg">
      <div>
        <p className="text-sm text-gray-400">Date</p>
        <p className="font-semibold">{game.date}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Bet</p>
        <p className="font-semibold">{game.bet} chips</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Score</p>
        <p className="font-semibold">
          You: {game.playerScore} | Dealer: {game.dealerScore}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Result</p>
        <p className={`font-semibold ${resultColor}`}>
            {game.result}
            {game.payout > 0 && (
                <span className="text-green-500"> (+{game.payout})</span>
            )}
            </p>
      </div>
    </div>
  );
}
