// components/Header.tsx
import Link from "next/link";

export default function Header({ balance = 250 }) {
  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-black text-white">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Blackjack</h1>
        <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
          <span>🪙 {balance}</span>
          <button className="ml-2 text-white font-bold">+</button>
        </div>
      </div>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/">Home</Link>
        <Link href="/history">History</Link>
        <button className="hover:underline">Logout</button>
        <button className="bg-gray-800 p-1 rounded-full">🌙</button>
      </nav>
    </div>
  );
}