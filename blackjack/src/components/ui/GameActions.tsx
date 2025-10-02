// components/GameActions.tsx
export default function GameActions({
  onHit,
  onStand,
  onNewGame,
  isGameOver
}: {
  onHit: () => void;
  onStand: () => void;
  onNewGame: () => void;
  isGameOver: boolean;
}) {
    
  return (
    <div className="flex justify-center gap-4 mt-6">
      {isGameOver ? (
        <button onClick={onNewGame} className="bg-yellow-500 text-black px-4 py-2 rounded">
          New Game
        </button>
      ) : (
        <>
          <button onClick={onHit} className="bg-blue-600 px-4 py-2 rounded text-white">
            Hit
          </button>
          <button onClick={onStand} className="bg-red-600 px-4 py-2 rounded text-white">
            Stand
          </button>
        </>
      )}
    </div>
  );
}
