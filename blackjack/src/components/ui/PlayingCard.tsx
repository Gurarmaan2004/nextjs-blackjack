// components/Card.tsx
export default function PlayingCard({ value }: { value?: string }) {
  return (
    <div className="w-[60px] h-[90px] border-2 border-white rounded-lg bg-gray-900 flex items-center justify-center text-lg font-semibold">
      {value || ""}
    </div>
  );
}