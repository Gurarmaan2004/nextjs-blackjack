interface PlayerLabelProps {
  role: "You" | "Dealer";
  score?: number;            // Only shown once game has started
  outcome?: string; // Only shown at game end
}

export default function PlayerLabel({ role, score, outcome }: PlayerLabelProps) {
  const isGameOver = !!outcome;
  const bgColor = outcome === "Win" ? "bg-green-500" :
                  outcome === "Lose" ? "bg-red-500" :
                  outcome === "Push" ? "bg-gray-500" : "bg-white";

  const textColor = isGameOver ? "text-white" : "text-black";

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded ${bgColor}`}>
      {score !== undefined && (
        <span className={`font-semibold ${textColor}`}>{score}</span>
      )}
      <span className={`font-medium ${textColor}`}>
        {isGameOver ? outcome : role}
      </span>
    </div>
  );
}
