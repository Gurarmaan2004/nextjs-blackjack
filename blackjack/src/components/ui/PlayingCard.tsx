// components/PlayingCard.tsx
type CardProps = {
  value: string;       // e.g., "K♠"
  flipped: boolean;    // should the card be revealed
};

export default function PlayingCard({ value, flipped }: CardProps) {
  return (
    <div className="w-20 h-32 perspective">
      <div className={`relative w-full h-full transition-transform duration-500 transform-style preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
        {/* Front (face down) */}
        <div className="absolute w-full h-full backface-hidden bg-gray-700 rounded-lg shadow-inner flex items-center justify-center text-white">
          🂠
        </div>
        
        {/* Back (actual card) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-lg shadow-md flex items-center justify-center text-xl font-bold">
          {value}
        </div>
      </div>
    </div>
  );
}
