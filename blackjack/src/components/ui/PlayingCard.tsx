// components/PlayingCard.tsx

type CardProps = {
  value: string;
  flipped: boolean;
};

export default function PlayingCard({ value, flipped }: CardProps) {
  return (
    <div className="w-20 h-32 perspective">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full backface-hidden rounded-xl border-2 border-white dark:border-white bg-gray-100 dark:bg-black flex items-center justify-center shadow-inner">
          <div className="w-4/5 h-4/5 bg-gray-300 dark:bg-gray-800 rounded-md opacity-50" />
        </div>

        {/* Card Face */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl border-2 border-white dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white flex items-center justify-center text-2xl font-bold shadow-md">
          {value}
        </div>
      </div>
    </div>
  );
}
