'use client';

import { useEffect, useState } from 'react';
// import { getGameHistory } from '@/lib/historyUtils'; // You'll implement this
import GameHistoryItem from '@/components/ui/GameHistoryItem';

interface GameRecord {
  date: string;
  bet: number
  playerScore: number;
  dealerScore: number;
  result: string;
  payout: number;
}

export default function GameHistoryPage() {
    const [userId, setUserId] = useState<string | null>(null);
  const [gameData, setGameData] = useState<[]>([]);
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;

  
useEffect(() => {
    const initUser = async () => {
      const res = await fetch('/api/user/guest');
      const data = await res.json();
      if (data.guestId) {
        console.log(data.guestId);
        setUserId(data.guestId);

        // Fetch balance with guestId
        const gameRes = await fetch('/api/game/gethistory', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.guestId }),
        });
        const gameData = await gameRes.json();
        console.log(gameData)
        setHistory(
          gameData.data.map((game: any) => ({
            date: formatDate(game.createdAt), // Format the timestamp
            playerScore: game.userScore,
            dealerScore: game.dealerScore,
            result: game.result,
            payout: game.payout ?? 0, // default to 0 if null
            bet: game.bet
          }))
        );
        console.log(gameData)
        
      }
    };
    initUser();
  }, []);
  const start = (page - 1) * perPage;
  const paginated = history.slice(start, start + perPage);
  const totalPages = Math.ceil(history.length / perPage);


  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Game History</h1>

      <div className="space-y-4">
        {paginated.map((game, idx) => (
          <GameHistoryItem key={idx} game={game} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ←
        </button>
        <span className="px-4 py-2">{page} / {totalPages}</span>
        <button
          className="px-3 py-1 rounded bg-gray-800 hover:bg-gray-700"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          →
        </button>
      </div>

      <p className="mt-2 text-sm text-center text-gray-400">
        Showing {start + 1}–{Math.min(start + perPage, history.length)} of {history.length} games
      </p>
    </div>
  );
}