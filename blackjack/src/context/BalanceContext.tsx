// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// type BalanceContextType = {
//   balance: number;
//   setBalance: (balance: number) => void;
// };

// const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

// export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
//   const [balance, setBalance] = useState<number>(() => {
//     // Try to get from localStorage first
//     const stored = localStorage.getItem("balance");
//     return stored ? parseInt(stored, 10) : 250; // fallback default
//   });

//   useEffect(() => {
//     const initUser = async () => {
//       const storedUserId = localStorage.getItem("guestId");
//       let guestId = storedUserId;

//       if (!guestId) {
//         const res = await fetch("/api/user/guest");
//         const data = await res.json();

//         const newGuestId = data;
//         localStorage.setItem("guestId", newGuestId);
//       }

//       // Fetch balance with guestId
//       const balanceRes = await fetch("/api/balance/get", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId: guestId }),
//       });
//       const balanceData = await balanceRes.json();
//       setBalance(balanceData.chips);
//       localStorage.setItem("balance", balanceData.chips);
//     };

//     initUser();
//   }, []);

//   // Optional: keep balance in sync if updated elsewhere in app
//   useEffect(() => {
//     localStorage.setItem("balance", balance.toString());
//   }, [balance]);

//   return (
//     <BalanceContext.Provider value={{ balance, setBalance }}>
//       {children}
//     </BalanceContext.Provider>
//   );
// };

// export const useBalance = () => {
//   const context = useContext(BalanceContext);
//   if (!context) {
//     throw new Error("useBalance must be used within a BalanceProvider");
//   }
//   return context;
// };


"use client";
import { createContext, useContext, useState, useEffect } from "react";

type BalanceContextType = {
  balance: number;
  setBalance: (balance: number) => void;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState<number>(250); // start with default
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // This only runs in the browser
    const initUser = async () => {
      let guestId = localStorage.getItem("guestId");

      if (!guestId) {
        // fetch guestId from server
        const res = await fetch("/api/user/guest");
        const data = await res.json();
        const newGuestId: string = data.guestId;
        localStorage.setItem("guestId", newGuestId);
      }

      setUserId(guestId);

      // Fetch balance from server
      const balanceRes = await fetch("/api/balance/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: guestId }),
      });
      const balanceData = await balanceRes.json();
      setBalance(balanceData.chips);

      // store in localStorage for next reload
      localStorage.setItem("balance", balanceData.chips);
    };

    initUser();
  }, []);

  // Whenever balance changes, update localStorage
    useEffect(() => {
    localStorage.setItem("balance", balance.toString());
    }, [balance]);

  return (
    <BalanceContext.Provider value={{ balance, setBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within a BalanceProvider");
  }
  return context;
};
