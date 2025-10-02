export default function PlayingCard({ symbol }: { symbol: string }) {
  return (
    <div className="bg-white text-black rounded-md p-4 text-2xl w-16 h-24 flex items-center justify-center shadow">
      {symbol}
    </div>
  );
}