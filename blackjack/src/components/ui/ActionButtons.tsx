export default function ActionButtons({ onHit, onStand }: { onHit: () => void; onStand: () => void }) {
  return (
    <div className="flex justify-center gap-4 mt-6">
      <button className="btn bg-blue-600" onClick={onHit}>
        Hit
      </button>
      <button className="btn bg-yellow-600" onClick={onStand}>
        Stand
      </button>
      <button className="btn bg-purple-600" onClick={() => alert("TODO: Double Down")}>
        Double
      </button>
    </div>
  );
}
