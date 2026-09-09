import React from "react";

const C = {
  gold: "#E0A438",
  vermilion: "#BD4433",
  sage: "#5C7A5A",
  teal: "#145952",
};

export default function Garland({ tone = "light" }) {
  const colors = [C.gold, C.vermilion, C.sage, C.gold, C.teal];
  const dots = Array.from({ length: 16 });
  return (
    <div style={{ position: "relative", height: 22, margin: "4px 0 10px", width: "100%" }} aria-hidden="true">
      <div style={{
        position: "absolute", top: 8, left: 0, right: 0, height: 1.5,
        background: tone === "light" ? "rgba(46,36,23,0.18)" : "rgba(250,243,228,0.28)"
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", position: "relative", top: -2 }}>
        {dots.map((_, i) => (
          <span key={i} style={{
            width: 8, height: 8, borderRadius: "50%",
            background: colors[i % colors.length],
            marginTop: i % 2 === 0 ? 8 : 4,
            boxShadow: "0 1px 2px rgba(0,0,0,0.15)"
          }} />
        ))}
      </div>
    </div>
  );
}
