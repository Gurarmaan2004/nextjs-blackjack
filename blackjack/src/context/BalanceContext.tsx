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
  const [balance, setBalance] = useState<number>(0); // start with default
  const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
    const initUser = async () => {
        let guestId = localStorage.getItem("guestId");

        if (!guestId) {
        const res = await fetch("/api/user/guest");
        const data = await res.json();
        guestId = data.guestId;
        if(guestId){
            localStorage.setItem("guestId", guestId);
        }
        }

        setUserId(guestId); // ✅ Only call after guestId is confirmed

        // ✅ Only fetch if balance not already stored
        const storedBalance = localStorage.getItem("balance");
        if (!storedBalance) {
        const balanceRes = await fetch("/api/balance/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: guestId }),
        });

        const balanceData = await balanceRes.json();
        if (balanceData?.chips !== undefined) {
            setBalance(balanceData.chips);
            localStorage.setItem("balance", balanceData.chips.toString());
        }
        } else {
        setBalance(parseInt(storedBalance, 10));
        }
    };

    if (typeof window !== "undefined") {
        initUser();
    }
    }, []);


    useEffect(() => {
    if (typeof window !== "undefined" && typeof balance === "number") {
        localStorage.setItem("balance", balance.toString());
    }
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
