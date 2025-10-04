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
  
  const [flipped, setFlipped] = useState([false, false, false, false]); // 4 cards
  const [controlsVisible, setControlsVisible] = useState(false);
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

  const getRandomCard = (): string => {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['♠', '♥', '♦', '♣'];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return `${rank}${suit}`;
  };
  const calculateHandValue = (cards: string[]): number => {
    let total = 0;
    let aces = 0;

    for (const card of cards) {
      const rank = card.slice(0, -1); // get rid of suit
      if (['J', 'Q', 'K'].includes(rank)) total += 10;
      else if (rank === 'A') {
        total += 11;
        aces += 1;
      } else {
        total += parseInt(rank);
      }
    }

    while (total > 21 && aces > 0) {
      total -= 10; // convert an Ace from 11 to 1
      aces--;
    }

    return total;
  };




  const startGame = () => {
    const playerCards = [getRandomCard(), getRandomCard()]
    const dealerCards = [getRandomCard(), getRandomCard()]
    setDealerCards(['Q♣', 'Hidden']);
    setGameStarted(true);

      // Sequential flip animation
    setTimeout(() => setFlipped([true, false, false, false]), 500);      // Player 1
    setTimeout(() => setFlipped([true, true, false, false]), 1000);      // Dealer 1
    setTimeout(() => setFlipped([true, true, true, false]), 1500);       // Player 2
    setTimeout(() => setControlsVisible(true), 2000);             // Show actions

  };

  const handleHit = () => {
    
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
    setFlipped([false, false, false, false])
    setStatus('');
  };

  return (
    <div className="p-6">
      <Balance balance={balance} />
      <BetControls bet={bet} setBet={setBet} />
      
    <div className="flex flex-col items-center my-8">
      <div className="flex gap-4 mb-2">
        <PlayingCard value={dealerCards[0]} flipped={flipped[1]} />
        <PlayingCard value="Hidden" flipped={flipped[3]} /> {/* face-down */}
      </div>
      <span>Dealer</span>
    </div>

    <div className="flex flex-col items-center my-8">
      <div className="flex gap-4 mb-2">
        <PlayingCard value={playerCards[0]} flipped={flipped[0]} />
        <PlayingCard value={playerCards[1]} flipped={flipped[2]} />
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
        {gameStarted && controlsVisible && (
          <GameActions
            onHit={handleHit}
            onStand={handleStand}
            onNewGame={handleNewGame}
            isGameOver={!!status}
          />
        )}

    </div>
  );
}
