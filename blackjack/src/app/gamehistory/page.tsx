'use client';

import { useEffect, useState } from 'react';
// import { getGameHistory } from '@/lib/historyUtils'; // You'll implement this
import GameHistoryItem from '@/components/ui/GameHistoryItem';

interface GameRecord {
  date: string;
  bet: number;
  playerScore: number;
  dealerScore: number;
  result: string;
}

export default function GameHistoryPage() {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [page, setPage] = useState(1);
  const perPage = 5;

  const getGameHistory = async function fetchBalance() {
      const res = await fetch('/api/balance/update', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "mock-user-id" })
      });
      const data = await res.json();
      console.log(data);

    }
  useEffect(() => {
    const data = getGameHistory(); // localStorage or API call
  }, []);

  const start = (page - 1) * perPage;
  const paginated = history.slice(start, start + perPage);
  const totalPages = Math.ceil(history.length / perPage);

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