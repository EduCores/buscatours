import React from "react";

export default function PixQRCode() {
  const N = 25;
  const isFinder = (r, c) => {
    const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const cells = [];
  let seed = 7;
  const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return (seed >> 8) & 1; };
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let black;
      if (isFinder(r, c)) {
        const fr = r < 7 ? r : r - (N - 7);
        const fc = c < 7 ? c : c - (N - 7);
        const ring = fr === 0 || fr === 6 || fc === 0 || fc === 6;
        const core = fr >= 2 && fr <= 4 && fc >= 2 && fc <= 4;
        black = ring || core;
      } else {
        black = rand() === 1;
      }
      if (black) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#000" />);
    }
  }
  return (
    <svg width="132" height="132" viewBox={`0 0 ${N} ${N}`} style={{ display: "block", shapeRendering: "crispEdges" }}>
      <rect width={N} height={N} fill="#fff" />
      {cells}
    </svg>
  );
}
