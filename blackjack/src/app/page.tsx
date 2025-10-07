"use client";

import { useState, useEffect } from "react";
import BetControls from "../components/ui/BetControls";
import Balance from "../components/ui/Balance";

import PlayingCard from "../components/ui/PlayingCard";
import PlayerLabel from "../components/ui/PlayerLabelProps";

import GameActions from "../components/ui/GameActions";
// import {getOrCreateGuestId} from '../utils/user';
import { useBalance } from "@/context/BalanceContext";

import './globals.css'

// import ResultBanner from "../components/ui/ResultBanner";
import ActionButtons from "../components/ui/ActionButtons";

// app/page.tsx or pages/index.tsx
export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const { balance, setBalance } = useBalance(); // use from context only
  const [bet, setBet] = useState(0);
  
  // const [flipped, setFlipped] = useState([false, false, false, false]); // 4 cards

  const [playerFlipped, setPlayerFlipped] = useState<boolean[]>([false, false]);
  const [dealerFlipped, setDealerFlipped] = useState<boolean[]>([false, false]);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerCards, setPlayerCards] = useState<string[]>(["Hidden", "Hidden"]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerCards, setDealerCards] = useState<string[]>(["Hidden", "Hidden"]);
  const [dealerScore, setDealerScore] = useState(0);

  const [recommendedAction, setRecommendedAction] = useState<string | null>(null);
  const [isFetchingRecommendation, setIsFetchingRecommendation] = useState(false);

  const [status, setStatus] = useState('');

  // const userId = getOrCreateGuestId();


useEffect(() => {
    const initUser = async () => {
      const res = await fetch('/api/user/guest');
      const data = await res.json();
      console.log(data)
      if (data.guestId) {
        console.log(data.guestId);
        setUserId(data.guestId);

        // Fetch balance with guestId
        const balanceRes = await fetch('/api/balance/get', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: data.guestId }),
        });
        const balanceData = await balanceRes.json();
        setBalance(balanceData.chips);
      }
    };
    initUser();
  }, []);

  const handleBet = async (amount: number) => {
    if (balance >= amount && !gameStarted) {
      setBalance(balance - amount); // or however your logic computes it;
      console.log("balance set");
      // Backend: Log chip deduction
      await fetch('/api/balance/update', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,  // Replace this with actual user ID from session/auth
          newBalance: balance-amount,
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




  const startGame = () => {
  const newPlayerCards = [getRandomCard(), getRandomCard()];
  const newDealerCards = [getRandomCard(), getRandomCard()];
  handleBet(bet);
  setGameStarted(true);
  // Card 1: Player
  setTimeout(() => {
    setPlayerCards([newPlayerCards[0], "Hidden"]);
    setPlayerScore(calculateHandValue([newPlayerCards[0]]));
    setPlayerFlipped([true, false]);
  }, 500);

  // Card 1: Dealer
  setTimeout(() => {
    setDealerCards(newDealerCards);
    setDealerScore(calculateHandValue([newDealerCards[0]]));
    setDealerFlipped([true, false]);
  }, 1000);

  // Card 2: Player
  setTimeout(() => {
    setPlayerCards([newPlayerCards[0], newPlayerCards[1]]);
    setPlayerScore(calculateHandValue(newPlayerCards));
    setPlayerFlipped([true, true]);
  }, 1500);

  // Finally show hit/stand controls
  setTimeout(() => {
    setControlsVisible(true);
  }, 2000);
};

const handleDealerTurn = async (currentPlayerCards: string[]) => {
  setControlsVisible(false);
  // work with local copies so we don't rely on stale React state
  const currentDealerCards = [...dealerCards];
  let currentScore = calculateHandValue(currentDealerCards);
  // reveal hidden card
  setTimeout(() => {
    currentDealerCards[1] = getRandomCard();
    currentScore = calculateHandValue(currentDealerCards);
    setDealerCards(currentDealerCards);
    setDealerScore(currentScore);
    setDealerFlipped([true, true]); // reveal both dealer cards visually
  }, 500)
  

  // simulate dealer hitting (16 or less)
  while (currentScore <= 16) {
    const newCard = getRandomCard();
    const thirdDealerCards = [...currentDealerCards, newCard];
    currentScore = calculateHandValue(thirdDealerCards);

    // update UI incrementally
    setTimeout(() => {
      setDealerCards(thirdDealerCards);
      setDealerScore(currentScore);
      setDealerFlipped([true, true, true]); // flip new card
      // console.log(flipped);
    }, 1000); // you can stagger multiple cards here with delays
  }
  const currentPlayerScore = calculateHandValue(currentPlayerCards)
  console.log("dealer score", currentScore, " player score", currentPlayerScore);
  console.log(dealerFlipped);
  // once dealer stops hitting, decide outcome
  let currentStatus = '';
  setTimeout(async () => {
  if (currentScore > 21) {
    currentStatus = "Win";
  } else if (currentPlayerScore > 21) {
    currentStatus = "Lose";
  } else if (currentScore > currentPlayerScore) {
    currentStatus = "Lose";
  } else if (currentScore === currentPlayerScore) {
    currentStatus = "Push";
  } else {
    currentStatus = "Win";
  }

  setStatus(currentStatus);
  setGameOver(true);

  let payout = 0;
  if (currentStatus === "Win") payout = bet * 2;
  if (currentStatus === "Push") payout = bet;

  console.log("BAL", balance, "BET", bet, "PAYOUT", payout);
  if (payout > 0) {
    await fetch('/api/balance/update', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        newBalance: balance + payout,
        reason: currentStatus === "Push" ? "Push - Refund" : "Won Game"
      })
    });
    setBalance(balance + payout); // or however your logic computes it;
  }

  await fetch('/api/game/save', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userId,
      bet,
      result: currentStatus,
      userScore: calculateHandValue(currentPlayerCards),
      dealerScore: currentScore,
      payout
    })
  });
  setControlsVisible(true);
}, 1000);
};


  const handleHit = async () => {
    const newPlayerCards = [...playerCards, getRandomCard()]
    setPlayerCards(newPlayerCards)

    setPlayerScore(calculateHandValue(newPlayerCards));
    setPlayerFlipped([...playerFlipped, true]);

    await handleDealerTurn(newPlayerCards)
  };

  const handleStand = async () => {
    await handleDealerTurn(playerCards);
  };

  const handleNewGame = () => {
    setBet(0);
    setGameOver(false);
    setGameStarted(false);
    setPlayerCards(["", ""]);
    setDealerCards(["", ""]);
    setDealerScore(0);
    setPlayerScore(0);
    setPlayerFlipped([false, false])
    setDealerFlipped([false, false])
    setStatus('');
  };

  // const fetchGeminiRecommendation = async () => {
  //   const res = await fetch("/api/recommendation", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       playerScore, 
  //       dealerCard: dealerCards[0],
  //     }),
  //   });

  //   const data = await res.json();
  //   setRecommendedAction(data.recommendation);
  // };
  const fetchGeminiRecommendation = async () => {
    setIsFetchingRecommendation(true);
    try {
      // your existing API logic
      const res = await fetch("/api/recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerScore, 
          dealerCard: dealerCards[0],
        }),
      });
      const data = await res.json();
      setRecommendedAction(data.recommendation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingRecommendation(false);
    }
  };


  return (
    <div className="p-6">
    <div className="flex flex-col items-center my-8">
  {/* Container for dealer cards */}
  <div className="relative w-[200px] h-[80px] mb-14">
    {
    dealerCards.map((card, idx) => {
      console.log(dealerCards)
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
          <PlayingCard value={card} flipped={dealerFlipped[idx]} />
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
          //console.log("Rendering player card:", idx, card, flipped[idx * 2]);
          return (
            <div key={idx} className={`${baseClass} ${positionStyle}`}>
              <PlayingCard value={card} flipped={playerFlipped[idx]} />
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
  <div className="flex justify-center gap-4 mt-6">
    {gameOver ? (
      <button
        onClick={handleNewGame}
        className="bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        New Game
      </button>
    ) : (
      <>
        {/* Hit Button */}
        <button
          onClick={handleHit}
          className="bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Hit
        </button>

        {/* AI Recommendation Button */}
        <button
          onClick={fetchGeminiRecommendation}
          className="relative flex items-center justify-center w-10 h-10 rounded-full border transition bg-white dark:bg-black text-black dark:text-white border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={isFetchingRecommendation} // assumes you're tracking loading state
        >
          {isFetchingRecommendation ? (
            <span className="w-5 h-5 border-2 border-t-transparent border-black dark:border-white rounded-full animate-spin" />
          ) : (
            "?"
          )}
        </button>

        {/* Stand Button */}
        <button
          onClick={handleStand}
          className="bg-white dark:bg-black text-black dark:text-white px-4 py-2 rounded font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Stand
        </button>
      </>
    )}
  </div>
)}


      {!gameStarted && (
        <BetControls bet={bet} setBet={setBet} onPlaceBet={handleBet} />
      )}


      {bet > 0 && !gameStarted && (
        <div className="flex justify-center mt-4">
          <button
            onClick={startGame}
            className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            Place Bet
          </button>
        </div>
      )}
    
    {/* <div className="flex justify-center mt-4">
          <button
            onClick={fetchGeminiRecommendation}
            className="w-40 py-3 bg-white text-black rounded hover:bg-gray-300 transition"
          >
            AI Recommendation
          </button>
    </div> */}
    {recommendedAction && (
      <div className="text-center text-green-500 text-sm mt-2">
        AI Suggests: <strong>{recommendedAction}</strong>
      </div>
    )}
    </div>
  );
}
