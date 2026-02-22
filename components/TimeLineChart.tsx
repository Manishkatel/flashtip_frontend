"use client";
import { useRef, useState, useEffect } from "react";
import { white, line, ink, stone, plum, sky, coral } from "@/lib/theme";
import type { TimelineDataPoint } from "@/types";

interface TimelineChartProps {
  data: TimelineDataPoint[];
}

interface TooltipData extends TimelineDataPoint {
  x: number;
  y: number;
}

export function TimelineChart({ data }: TimelineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<TooltipData | null>(null);
  const [hIdx, setHIdx] = useState<number | null>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !wrapRef.current) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = wrapRef.current.clientWidth, H = 180;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.scale(dpr, dpr);
    const p = { t: 16, r: 16, b: 36, l: 44 };
    const cW = W - p.l - p.r, cH = H - p.t - p.b;
    ctx.clearRect(0, 0, W, H);
    const maxT = Math.max(...data.map((d: TimelineDataPoint) => d.tips));
    const maxS = Math.max(...data.map((d: TimelineDataPoint) => d.sol));
    const xS = (i: number) => p.l + (i / (data.length - 1)) * cW;
    const yS = (v: number) => p.t + cH - (v / maxS) * cH;

    // Horizontal grid lines + Y-axis labels
    for (let i = 0; i <= 4; i++) {
      const y = p.t + (cH / 4) * i;
      ctx.beginPath(); ctx.strokeStyle = "#F0F0F0"; ctx.lineWidth = 1;
      ctx.moveTo(p.l, y); ctx.lineTo(p.l + cW, y); ctx.stroke();
      ctx.fillStyle = "#A1A1AA"; ctx.font = "10px 'Geist Mono'"; ctx.textAlign = "right";
      ctx.fillText(String(Math.round(maxT - (maxT / 4) * i)), p.l - 6, y + 4);
    }

    // SOL area fill (gradient under the line)
    const gSol = ctx.createLinearGradient(0, p.t, 0, p.t + cH);
    gSol.addColorStop(0, sky + "35"); gSol.addColorStop(1, sky + "00");
    ctx.beginPath();
    data.forEach((d: TimelineDataPoint, i: number) => { const x = xS(i), y = yS(d.sol); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.lineTo(xS(data.length - 1), p.t + cH); ctx.lineTo(xS(0), p.t + cH); ctx.closePath();
    ctx.fillStyle = gSol; ctx.fill();

    // SOL line
    ctx.beginPath(); ctx.strokeStyle = sky; ctx.lineWidth = 2; ctx.lineJoin = "round";
    data.forEach((d: TimelineDataPoint, i: number) => { const x = xS(i), y = yS(d.sol); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.stroke();

    // Tip count bars (plum → coral gradient, brighter on hover)
    const bW = Math.max(3, cW / data.length - 3);
    data.forEach((d, i) => {
      const x = xS(i) - bW / 2, bH = (d.tips / maxT) * cH, y = p.t + cH - bH;
      const isH = hIdx === i;
      const g = ctx.createLinearGradient(0, y, 0, y + bH);
      g.addColorStop(0, isH ? plum : plum + "CC");
      g.addColorStop(1, isH ? coral + "AA" : coral + "44");
      ctx.fillStyle = g; ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, bW, bH, 2); else ctx.rect(x, y, bW, bH);
      ctx.fill();
    });

    // Hover crosshair line
    if (hIdx !== null) {
      const x = xS(hIdx);
      ctx.beginPath(); ctx.strokeStyle = "#00000015"; ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]); ctx.moveTo(x, p.t); ctx.lineTo(x, p.t + cH); ctx.stroke(); ctx.setLineDash([]);
    }

    // X-axis time labels
    ctx.fillStyle = "#A1A1AA"; ctx.font = "10px 'Geist Mono'"; ctx.textAlign = "center";
    [0, 12, 24, 36, 47].forEach(i => {
      const s = data[i].second;
      ctx.fillText(`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, xS(i), H - 8);
    });
  };

  useEffect(() => { draw(); }, [data, hIdx]);
  // Redraw on container resize (responsive canvas)
  useEffect(() => {
    const obs = new ResizeObserver(() => draw());
    if (wrapRef.current) obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const xRel = e.clientX - rect.left;
    const cW = rect.width - 44 - 16;
    const idx = Math.round(((xRel - 44) / cW) * (data.length - 1));
    if (idx >= 0 && idx < data.length) {
      setHIdx(idx);
      setTip({ x: xRel, y: e.clientY - rect.top, ...data[idx] });
    }
  };

  return (
    <div style={{ background: white, borderRadius: 16, border: `1px solid ${line}`, padding: "20px 20px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {/* Header + legend */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: "Geist", fontWeight: 600, fontSize: 15, color: ink }}>When do people tip?</div>
          <div style={{ fontFamily: "Geist", fontSize: 13, color: stone, marginTop: 2 }}>Tip activity mapped across video playback time</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {[{ c: plum, l: "Tips" }, { c: sky, l: "SOL volume" }].map(({ c, l }) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: c, borderRadius: 99 }} />
              <span style={{ fontFamily: "Geist", fontSize: 12, color: stone }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Canvas wrapper — ResizeObserver watches this div */}
      <div ref={wrapRef} style={{ position: "relative", height: 180 }}>
        <canvas ref={canvasRef} onMouseMove={onMove} onMouseLeave={() => { setHIdx(null); setTip(null); }}
          style={{ display: "block", cursor: "crosshair" }} />
        {/* Hover tooltip */}
        {tip && (
          <div style={{
            position: "absolute",
            left: Math.min(tip.x + 14, (wrapRef.current?.clientWidth || 500) - 130),
            top: Math.max(0, tip.y - 60),
            background: ink, color: white, borderRadius: 10, padding: "8px 12px",
            fontFamily: "Geist", fontSize: 12, pointerEvents: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)", whiteSpace: "nowrap", zIndex: 10,
          }}>
            <div style={{ color: "#A1A1AA", marginBottom: 4, fontFamily: "Geist Mono", fontSize: 11 }}>
              @ {Math.floor(tip.second / 60)}:{String(tip.second % 60).padStart(2, "0")}
            </div>
            <div style={{ color: plum + "EE" }}>▪ {tip.tips} tips</div>
            <div style={{ color: sky }}>▪ ◎ {tip.sol} SOL</div>
          </div>
        )}
      </div>
    </div>
  );
}
