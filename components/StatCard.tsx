"use client";
import { useState } from "react";
import { useCounter } from "@/hooks/useCounter";
import { white, line, ink, stone, sage, coral } from "@/lib/theme";

interface StatCardProps {
  label: string;
  rawValue: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  accent: string;
  note?: string;
  delta?: number | null;
}

export function StatCard({ label, rawValue, prefix = "", suffix = "", decimals = 0, accent, note, delta }: StatCardProps) {
  const count = useCounter(rawValue, decimals); // animated count-up on mount
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: white, border: `1px solid ${hover ? accent + "55" : line}`,
        borderRadius: 16, padding: "22px 22px 18px",
        display: "flex", flexDirection: "column", gap: 6,
        transition: "border-color 0.2s, box-shadow 0.2s",
        boxShadow: hover ? `0 4px 20px ${accent}18` : "0 1px 4px rgba(0,0,0,0.05)",
        cursor: "default",
      }}
    >
      {/* Label row with optional delta badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "Geist", fontSize: 13, color: stone, fontWeight: 500 }}>{label}</span>
        {delta != null && (
          <span style={{
            fontFamily: "Geist", fontSize: 12, fontWeight: 500,
            color: delta > 0 ? sage : coral,
            background: delta > 0 ? "#F0FDF4" : "#FFF7ED",
            padding: "2px 8px", borderRadius: 20,
          }}>{delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%</span>
        )}
      </div>
      {/* Animated value */}
      <div style={{ fontFamily: "Geist Mono", fontSize: 34, fontWeight: 700, color: ink, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
        {prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
      </div>
      {note && <div style={{ fontFamily: "Geist", fontSize: 12, color: stone }}>{note}</div>}
      {/* Accent progress bar that expands on hover */}
      <div style={{ height: 3, borderRadius: 99, background: line, overflow: "hidden", marginTop: 4 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: `linear-gradient(90deg, ${accent}, ${accent}99)`,
          width: hover ? "85%" : "55%",
          transition: "width 0.5s cubic-bezier(.34,1.56,.64,1)",
        }} />
      </div>
    </div>
  );
}
