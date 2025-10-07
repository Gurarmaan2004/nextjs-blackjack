// components/PlayingCard.tsx
type CardProps = {
  value: string;       // e.g., "K♠"
  flipped: boolean;    // should the card be revealed
};

export default function PlayingCard({ value, flipped }: CardProps) {
  return (
    <div className="w-20 h-32 perspective">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front (face down) */}
        <div className="absolute w-full h-full backface-hidden bg-gray-300 dark:bg-gray-800 rounded-lg shadow-inner flex items-center justify-center text-black dark:text-white">
          🂠
        </div>

        {/* Back (actual card face) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-gray-900 rounded-lg shadow-md flex items-center justify-center text-xl font-bold text-black dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}
