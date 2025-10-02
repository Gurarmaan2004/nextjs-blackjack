export default function Balance({ chips }: { chips: number }) {
  return (
    <div className="text-lg font-bold mb-4">
      Chips: <span className="text-yellow-400">{chips}</span>
    </div>
  );
}