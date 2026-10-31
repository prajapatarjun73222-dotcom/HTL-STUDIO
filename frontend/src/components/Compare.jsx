import { useState } from "react";

export function Compare({ before, after }) {
  const [pos, setPos] = useState(50);

  return (
    <div className="compare" style={{ "--pos": `${pos}%` }}>
      <img className="compare-after" src={after} alt="" />
      <div className="compare-before">
        <img src={before} alt="" />
      </div>
      <span className="compare-handle" aria-hidden="true" />
      <input
        className="compare-range"
        type="range"
        min="0"
        max="100"
        value={pos}
        aria-label="Drag to compare before and after"
        onChange={(event) => setPos(Number(event.target.value))}
      />
    </div>
  );
}
