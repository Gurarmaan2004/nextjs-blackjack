"use client";

import { useState } from "react";
import BetControls from "../components/ui/BetControls";
import Balance from "../components/ui/Balance";
import Hand from "../components/ui/Hand";
import GameTable from "../components/ui/GameTable";
import PlayingCard from "../components/ui/PlayingCard";
import GameActions from "../components/ui/GameActions";


// import ResultBanner from "../components/ui/ResultBanner";
import ActionButtons from "../components/ui/ActionButtons";

// app/page.tsx or pages/index.tsx
export default function HomePage() {
  const [balance, setBalance] = useState(250);
  const [bet, setBet] = useState(0);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [playerCards, setPlayerCards] = useState<string[]>([]);
  const [dealerCards, setDealerCards] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  
  const handleBet = (amount: number) => {
    if (balance >= amount && !gameStarted) {
      setBet(bet + amount);
      setBalance(balance - amount);
    }
  };

  const startGame = () => {
    setPlayerCards(['K♠', '7♦']);
    setDealerCards(['Q♣', 'Hidden']);
    setGameStarted(true);


  };

  const handleHit = () => {
    setPlayerCards(prev => [...prev, '2♣']);
  };

  const handleStand = () => {
    setDealerCards(['Q♣', '6♠']);
    setStatus('You Win!');
  };

  const handleNewGame = () => {
    setBet(0);
    setGameStarted(false);
    setPlayerCards([]);
    setDealerCards([]);
    setStatus('');
  };

  return (
    <div className="p-6">
      <Balance balance={balance} />
      <BetControls bet={bet} setBet={setBet} />
      

      <div className="flex flex-col items-center my-8">
      <div className="flex gap-4 mb-2">
        <PlayingCard />
        <PlayingCard />
      </div>
      <span>Dealer</span>
    </div>

    <div className="flex flex-col items-center my-8">
      <div className="flex gap-4 mb-2">
        <PlayingCard />
        <PlayingCard />
      </div>
      <span>You</span>
    </div>
      {bet > 0 && !gameStarted && (
        <div className="flex justify-center mt-4">
          <button
            onClick={startGame}
            className="bg-yellow-500 text-black px-6 py-2 rounded"
          >
            Deal
          </button>
        </div>
      )}
      {gameStarted && (
        <>
          <GameTable dealerCards={dealerCards} playerCards={playerCards} status={status} />
          <GameActions
            onHit={handleHit}
            onStand={handleStand}
            onNewGame={handleNewGame}
            isGameOver={!!status}
          />
        </>
      )}
    </div>
  );
}
