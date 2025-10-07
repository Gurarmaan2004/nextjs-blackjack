"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useBalance } from "@/context/BalanceContext";

export default function ChipPurchaseModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const { balance, setBalance } = useBalance();

  const handlePurchase = async (amount: number) => {
    setBalance(balance + amount);
    onClose(); // ⬅️ Close immediately

    // Optional: persist to backend
    await fetch("/api/balance/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        userId: localStorage.getItem("guestId"),
        newBalance: balance + amount,
        reason: `Purchased ${amount} chips`,
        }),
    });
    };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg w-[90%] max-w-md p-6 relative"
            initial={{ y: 100, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 100, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-xl font-bold hover:text-red-500"
              onClick={onClose}
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-2">Buy Chips</h2>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Select the amount of chips you want to purchase.
            </p>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {[100, 500, 1000, 5000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handlePurchase(amt)}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg py-4 font-bold text-lg transition"
                >
                  {amt} Chips
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
