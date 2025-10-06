"use client";

import { useState, useEffect } from "react";
import BetControls from "../components/ui/BetControls";
import Balance from "../components/ui/Balance";
import Hand from "../components/ui/Hand";
import GameTable from "../components/ui/GameTable";
import PlayingCard from "../components/ui/PlayingCard";
import PlayerLabel from "../components/ui/PlayerLabelProps";

import GameActions from "../components/ui/GameActions";
import './globals.css'

// import ResultBanner from "../components/ui/ResultBanner";
import ActionButtons from "../components/ui/ActionButtons";

// app/page.tsx or pages/index.tsx
export default function HomePage() {
  const [balance, setBalance] = useState(250);
  const [bet, setBet] = useState(0);
  
  const [flipped, setFlipped] = useState([false, false, false, false]); // 4 cards
  const [controlsVisible, setControlsVisible] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerCards, setPlayerCards] = useState<string[]>(["Hidden", "Hidden"]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<string[]>(["Hidden", "Hidden"]);
  const [dealerScore, setDealerScore] = useState(0);

  const [status, setStatus] = useState('');
  

  useEffect(() => {
    async function fetchBalance() {
      const res = await fetch('/api/balance/get', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "mock-user-id" })
      });
      const data = await res.json();
      setBalance(data.balance);
    }

    fetchBalance();
  }, []);
  const handleBet = async (amount: number) => {
  if (balance >= amount && !gameStarted) {
    setBet(bet + amount);
    setBalance(balance - amount);

    // Backend: Log chip deduction
    await fetch('/api/balance/update', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "mock-user-id",  // Replace this with actual user ID from session/auth
        delta: -amount,
        reason: "Bet Placed"
      })
    });
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




  // const startGame = () => {
  //   const newPlayerCards = [getRandomCard(), getRandomCard()];
  //   const newDealerCards = [getRandomCard(), getRandomCard()];

  //   setPlayerCards(newPlayerCards);
  //   setDealerCards(newDealerCards);


  //   setGameStarted(true);
  //     // Sequential flip animation
  //   setTimeout(() => setFlipped([true, false, false, false]), 500);      // Player 1
  //   setPlayerScore(calculateHandValue(playerCards.slice(0,1)))
  //   setTimeout(() => setFlipped([true, true, false, false]), 1000);      // Dealer 1
  //   setDealerScore(calculateHandValue(dealerCards.slice(0,1)))
  //   setTimeout(() => setFlipped([true, true, true, false]), 1500);       // Player 2
  //   setPlayerScore(calculateHandValue(dealerCards))
  //   setTimeout(() => setControlsVisible(true), 2000);             // Show actions

  //   console.log(playerCards)

    
  // };

  const startGame = () => {
  const newPlayerCards = [getRandomCard(), getRandomCard()];
  const newDealerCards = [getRandomCard(), getRandomCard()];


  setGameStarted(true);

  // Card 1: Player
  setTimeout(() => {
    setPlayerCards([newPlayerCards[0], "Hidden"]);
    setPlayerScore(calculateHandValue([newPlayerCards[0]]));
    setFlipped([true, false, false, false]);
  }, 500);

  // Card 1: Dealer
  setTimeout(() => {
    setDealerCards(newDealerCards);
    setDealerScore(calculateHandValue([newDealerCards[0]]));
    setFlipped([true, true, false, false]);
  }, 1000);

  // Card 2: Player
  setTimeout(() => {
    setPlayerCards([newPlayerCards[0], newPlayerCards[1]]);
    setPlayerScore(calculateHandValue(newPlayerCards));
    setFlipped([true, true, true, false]);
  }, 1500);

  // Finally show hit/stand controls
  setTimeout(() => {
    setControlsVisible(true);
  }, 2000);
};

const handleDealerTurn = async (currentPlayerCards: string[]) => {
  // work with local copies so we don't rely on stale React state
  let currentDealerCards = [...dealerCards];
  let currentScore = calculateHandValue(currentDealerCards);
  // reveal hidden card
  currentDealerCards[1] = getRandomCard();
  currentScore = calculateHandValue(currentDealerCards);
  setDealerCards(currentDealerCards);
  setDealerScore(currentScore);
  setFlipped([true, true, true, true]); // reveal both dealer cards visually

  // simulate dealer hitting (16 or less)
  while (currentScore <= 16) {
    const newCard = getRandomCard();
    currentDealerCards = [...currentDealerCards, newCard];
    currentScore = calculateHandValue(currentDealerCards);

    // update UI incrementally
    setTimeout(() => {
      setDealerCards(currentDealerCards);
      setDealerScore(currentScore);
      setFlipped(prev => [...prev, true]); // flip new card
    }, 500); // you can stagger multiple cards here with delays
  }
  const currentPlayerScore = calculateHandValue(currentPlayerCards)
  console.log("dealer score", currentScore, " player score", currentPlayerScore);
  // once dealer stops hitting, decide outcome
  setTimeout(() => {
    if (currentScore > 21) {
      setStatus("Win"); // dealer busts
    } else if (currentScore > playerScore) {
      setStatus("Lose");
    } else if (currentScore === playerScore) {
      setStatus("Push");
    } else {
      setStatus("Win");
    }
    setGameOver(true);
  }

  , 1000); // delay outcome until after animations finish

  // determine delta payout
  let payout = 0;
  if (status === "Win") payout = bet * 2;
  if (status === "Push") payout = bet;

  // Update balance if needed
  if (payout > 0) {
    await fetch('/api/balance/update', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "mock-user-id",
        delta: payout,
        reason: status === "Push" ? "Push - Refund" : "Won Game"
      })
    });
    setBalance(prev => prev + payout);
  }

  // Save Game Result
  await fetch('/api/game/save', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "mock-user-id",
      bet,
      result: status,
      userScore: calculateHandValue(currentPlayerCards),
      dealerScore: currentScore,
      finalState: {
        playerCards: currentPlayerCards,
        dealerCards
      }
    })
  });
};


  const handleHit = async () => {
    const newPlayerCards = [...playerCards, getRandomCard()]
    setPlayerCards(newPlayerCards)

    setPlayerScore(calculateHandValue(newPlayerCards));
    setFlipped([...flipped, true]);
    if(calculateHandValue(playerCards) > 21){
      setStatus('Win!');
      handleNewGame()
    }

    await handleDealerTurn(newPlayerCards)
  };

  const handleStand = async () => {
    await handleDealerTurn(playerCards);
  };

  const handleNewGame = () => {
    setBet(0);
    setGameOver(false);
    setGameStarted(false);
    setPlayerCards([]);
    setDealerCards([]);
    setDealerScore(0);
    setPlayerScore(0);
    setFlipped([false, false, false, false])
    setStatus('');
  };


  return (
    <div className="p-6">
      <Balance balance={balance} />
    <div className="flex flex-col items-center my-8">
  {/* Container for dealer cards */}
  <div className="relative w-[200px] h-[80px] mb-14">
    {dealerCards.map((card, idx) => {
      const baseClass = "absolute transition-all duration-300";

      // Logic for positioning cards
      let positionStyle = "";
      if (dealerCards.length === 2) {
        if (idx === 0) positionStyle = `left-[25%] translate-x-[-50%]`; // first card
        if (idx === 1) positionStyle = `left-[75%] translate-x-[-50%]`; // second card
      }
      if (dealerCards.length === 3) {
        if (idx === 0) positionStyle = `left-[0%] translate-x-[-50%]`; // first
        if (idx === 1) positionStyle = `left-[50%] translate-x-[-50%]`; // second
        if (idx === 2) positionStyle = `left-[100%] translate-x-[-50%]`; // third
      }

      return (
        <div key={idx} className={`${baseClass} ${positionStyle}`}>
          <PlayingCard value={card} flipped={flipped[idx * 2 + 1]} />
        </div>
      );
    })}
  </div>

  {/* Dealer Label */}
  <PlayerLabel
    role="Dealer"
    score={dealerScore}
    outcome={undefined}
  />
</div>

    <div className="flex flex-col items-center my-8">
      <div className="relative w-[200px] h-[80px] mb-14">
        {playerCards.map((card, idx) => {
          const baseClass = "absolute transition-all duration-300";
          
          // Logic for positioning cards
          let positionStyle = "";

          if (playerCards.length === 2) {
            if (idx === 0) positionStyle = `left-[25%] translate-x-[-50%]`; // first card
            if (idx === 1) positionStyle = `left-[75%] translate-x-[-50%]`; // second card
          }
          if (playerCards.length === 3) {
            if (idx === 0) positionStyle = `left-[0%] translate-x-[-50%]`; // first
            if (idx === 1) positionStyle = `left-[50%] translate-x-[-50%]`; // second
            if (idx === 2) positionStyle = `left-[100%] translate-x-[-50%]`; // third
          }
          console.log("Rendering player card:", idx, card, flipped[idx * 2]);
          return (
            <div key={idx} className={`${baseClass} ${positionStyle}`}>
              <PlayingCard value={card} flipped={flipped[idx * 2]} />
            </div>
          );
        })}
      </div>
          <PlayerLabel
            role="You"
            score={playerScore}
            outcome={gameOver ? status : undefined}
          />
    </div>

        {gameStarted && controlsVisible && (
          <GameActions
            onHit={handleHit}
            onStand={handleStand}
            onNewGame={handleNewGame}
            isGameOver={!!status}
          />
        )}


      {!gameStarted && (
        <BetControls bet={bet} setBet={setBet} onPlaceBet={() => handleBet(bet)} />
      )}


      {bet > 0 && !gameStarted && (
        <div className="flex justify-center mt-4">
          <button
            onClick={startGame}
            className="w-40 py-3 bg-white text-black rounded hover:bg-gray-300 transition"
          >
            Place Bet
          </button>
        </div>
      )}
    </div>
  );
}
