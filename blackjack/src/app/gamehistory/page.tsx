'use client';

import { useEffect, useState } from 'react';
import GameHistoryItem from '@/components/ui/GameHistoryItem';
import { getPaginationRange } from '@/utils/pagination';

interface GameRecord {
  date: string;
  bet: number;
  playerScore: number;
  dealerScore: number;
  result: string;
  payout: number;
}

export default function GameHistoryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const start = (page - 1) * perPage;
  const paginated = history.slice(start, start + perPage);
  const totalPages = Math.ceil(history.length / perPage);
  const pageNumbers = getPaginationRange(page, totalPages);

  useEffect(() => {
    const initUser = async () => {
      const res = await fetch('/api/user/guest');
      const data = await res.json();
      if (data.guestId) {
        setUserId(data.guestId);

        const gameRes = await fetch('/api/game/gethistory', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.guestId }),
        });
        const gameData = await gameRes.json();
        setHistory(
          gameData.data
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Newest first
            .map((game: any) => ({
              date: formatDate(game.createdAt),
              playerScore: game.userScore,
              dealerScore: game.dealerScore,
              result: game.result,
              payout: game.payout ?? 0,
              bet: game.bet
            }))
        );
      }
    };
    initUser();
  }, []);

  useEffect(() => {
    const savedHistory = localStorage.getItem("gameHistory");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("gameHistory", JSON.stringify(history));
    }
  }, [history]);

  function formatDate(timestamp: string): string {
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Game History</h1>

      <div className="space-y-4">
        {paginated.map((game, idx) => (
          <GameHistoryItem key={idx} game={game} />
        ))}
      </div>

      {/* Pagination UI */}
      <div className="flex justify-center items-center mt-6 gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-600 dark:border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-40"
        >
          &lt;
        </button>

        {pageNumbers.map((num, idx) => (
          <button
            key={idx}
            disabled={num === "..."}
            onClick={() => typeof num === 'number' && setPage(num)}
            className={`w-8 h-8 flex items-center justify-center rounded border
              ${num === page
                ? "bg-white text-black dark:bg-white dark:text-black"
                : "bg-black text-white dark:bg-gray-800 dark:text-white hover:bg-gray-700"
              }`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-gray-600 dark:border-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-40"
        >
          &gt;
        </button>
      </div>

      <p className="mt-2 text-sm text-center text-gray-400 dark:text-gray-500">
        Showing {start + 1}–{Math.min(start + perPage, history.length)} of {history.length} games
      </p>
    </div>
  );
}
