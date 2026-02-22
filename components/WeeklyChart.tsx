"use client";
import { useState } from "react";
import { white, line, ink, stone, gold, coral } from "@/lib/theme";
import type { WeeklyDataPoint } from "@/types";

interface WeeklyChartProps {
  data: WeeklyDataPoint[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxSol = Math.max(...data.map(d => d.sol));
  const [hov, setHov] = useState<number | null>(null);
  return (
    <div style={{ background: white, borderRadius: 16, border: `1px solid ${line}`, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ fontFamily: "Geist", fontWeight: 600, fontSize: 15, color: ink, marginBottom: 2 }}>This week</div>
      <div style={{ fontFamily: "Geist", fontSize: 13, color: stone, marginBottom: 18 }}>Daily SOL earned</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 90 }}>
        {data.map((d, i) => {
          const h = (d.sol / maxSol) * 100;
          const isH = hov === i;
          return (
            <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "default" }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              {/* Tooltip on hover */}
              {isH && <div style={{ fontFamily: "Geist Mono", fontSize: 10, color: stone, whiteSpace: "nowrap" }}>◎{d.sol}</div>}
              <div style={{
                width: "100%", height: isH ? `${h}%` : `${h * 0.95}%`,
                background: isH ? `linear-gradient(180deg, ${gold}, ${coral})` : `linear-gradient(180deg, ${gold}88, ${gold}33)`,
                borderRadius: "5px 5px 3px 3px", transition: "all 0.2s", minHeight: 4,
              }} />
              <span style={{ fontFamily: "Geist", fontSize: 11, color: isH ? ink : stone, fontWeight: isH ? 600 : 400 }}>{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
