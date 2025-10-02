import PlayingCard from "./PlayingCard";

export default function Hand({ cards }: { cards: string[] }) {
  return (
    <div className="flex gap-2 justify-center mt-2">
      {cards.map((card, i) => (
        <PlayingCard key={i} symbol={card} />
      ))}
    </div>
  );
}