"use client";
import { white, line, ink, stone, mist, plum, sky, sage, gold, TAG_COLORS } from "@/lib/theme";
import type { Video } from "@/types";

interface TopVideosProps {
  videos: Video[];
}

export function TopVideos({ videos }: TopVideosProps) {
  const top    = videos.slice(0, 3);
  const maxSol = Math.max(...top.map(v => v.totalSolEarned), 1);
  const barGrads = [
    `linear-gradient(90deg, ${plum}, ${sky})`,   // #1 — purple → blue
    `linear-gradient(90deg, ${sky}, ${sage})`,    // #2 — blue → green
    `linear-gradient(90deg, ${sage}, ${gold})`,   // #3 — green → yellow
  ];
  return (
    <div style={{ background: white, borderRadius: 16, border: `1px solid ${line}`, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ fontFamily: "Geist", fontWeight: 600, fontSize: 15, color: ink, marginBottom: 2 }}>Top tipped videos</div>
      <div style={{ fontFamily: "Geist", fontSize: 13, color: stone, marginBottom: 16 }}>Your highest earning content</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {top.map((v, i) => {
          const pct = Math.round((v.totalSolEarned / maxSol) * 100); // bar width relative to #1
          const tc  = [TAG_COLORS[3], TAG_COLORS[0], TAG_COLORS[2]][i];
          return (
            <div key={v.videoId}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {/* Rank badge */}
                  <div style={{
                    width: 22, height: 22, borderRadius: 7, background: tc.bg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Geist Mono", fontSize: 11, fontWeight: 700, color: tc.text,
                  }}>#{i + 1}</div>
                  <span style={{
                    fontFamily: "Geist", fontSize: 13, fontWeight: 500, color: ink,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 160,
                  }}>{v.title || v.videoLink}</span>
                </div>
                <span style={{ fontFamily: "Geist Mono", fontSize: 13, fontWeight: 600, color: ink, flexShrink: 0, marginLeft: 8 }}>
                  ◎ {v.totalSolEarned.toFixed(1)}
                </span>
              </div>
              {/* Proportional bar */}
              <div style={{ height: 6, background: mist, borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: barGrads[i], width: `${pct}%` }} />
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 5 }}>
                <span style={{ fontFamily: "Geist", fontSize: 11, color: stone }}>{v.tipsCount} tips</span>
                {v.views && (
                  <><span style={{ fontFamily: "Geist", fontSize: 11, color: stone }}>·</span>
                    <span style={{ fontFamily: "Geist", fontSize: 11, color: stone }}>{(v.views / 1000).toFixed(0)}k views</span></>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
