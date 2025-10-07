// components/Header.tsx

"use client"
import Link from "next/link";

import ThemeToggle from "./ThemeToggle";
import { useBalance } from "@/context/BalanceContext";
import ChipPurchaseModal from "./ChipPurchaseModal";

import { useState, useEffect } from "react";

export default function Header() {
    const {balance, setBalance} = useBalance();
    const [showModal, setShowModal] = useState(false);
    console.log(balance)
  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-black text-white">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Blackjack</h1>
        <div className="flex items-center bg-gray-800 px-3 py-1 rounded-full">
          <p>🪙 {balance}</p>
            <button
            onClick={() => setShowModal(true)}
            className="ml-2 font-bold text-lg transition-transform duration-200 hover:scale-125 hover:text-yellow-400 dark:hover:text-yellow-300"
            >
            +
            </button>
        </div>
      </div>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="/">Home</Link>
        <Link href="/gamehistory">History</Link>
        <button className="hover:underline">Logout</button>
        <ThemeToggle/>
      </nav>
      <ChipPurchaseModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
    
  );
}