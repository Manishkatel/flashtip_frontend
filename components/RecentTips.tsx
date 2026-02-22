"use client";
import { white, line, ink, stone, mist, TAG_COLORS } from "@/lib/theme";
import { shortAddr, fmtDuration, timeAgo } from "@/lib/utils";
import type { Tip } from "@/types";

interface RecentTipsProps {
  tips: Tip[];
}

export function RecentTips({ tips }: RecentTipsProps) {
  const displayed = tips.slice(0, 5); // cap at 5 most recent
  return (
    <div style={{ background: white, borderRadius: 16, border: `1px solid ${line}`, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div style={{ fontFamily: "Geist", fontWeight: 600, fontSize: 15, color: ink, marginBottom: 2 }}>Recent tips</div>
      <div style={{ fontFamily: "Geist", fontSize: 13, color: stone, marginBottom: 16 }}>Your latest supporters</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {displayed.length === 0 && (
          <div style={{ fontFamily: "Geist", fontSize: 13, color: stone, fontStyle: "italic", padding: "12px 0" }}>No tips yet.</div>
        )}
        {displayed.map((tip, i) => {
          const amt = Number(tip.sol_amount);
          // Color-code badge by tip size: ≥2 SOL → orange, ≥1 → purple, ≥0.5 → yellow, else blue
          const tc = amt >= 2 ? TAG_COLORS[1] : amt >= 1 ? TAG_COLORS[3] : amt >= 0.5 ? TAG_COLORS[4] : TAG_COLORS[0];
          const addr     = shortAddr(tip.tipper_address);
          const initials = addr.substring(0, 2).toUpperCase();
          const dur      = fmtDuration(tip.duration_spent);
          return (
            <div key={tip.id} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "13px 0",
              borderBottom: i < displayed.length - 1 ? `1px solid ${mist}` : "none",
            }}>
              {/* Avatar initials derived from wallet address */}
              <div style={{
                width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                background: `${tc.text}15`, border: `1px solid ${tc.text}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "Geist Mono", fontSize: 12, fontWeight: 600, color: tc.text,
              }}>{initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Address + time + amount badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontFamily: "Geist Mono", fontSize: 12, color: stone }}>{addr}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <span style={{ fontFamily: "Geist", fontSize: 11, color: stone }}>{timeAgo(tip.created_at)}</span>
                    <span style={{
                      fontFamily: "Geist Mono", fontSize: 12, fontWeight: 600,
                      color: tc.text, background: tc.bg, padding: "2px 9px", borderRadius: 20,
                    }}>◎ {amt.toFixed(2)}</span>
                  </div>
                </div>
                {/* Memo quote — only shown when present */}
                {tip.memo && (
                  <div style={{ fontFamily: "Geist", fontSize: 13, color: "#52525B", marginTop: 4, lineHeight: 1.4 }}>
                    "{tip.memo}"
                  </div>
                )}
                {/* Watch duration — only shown when present */}
                {dur && <div style={{ fontFamily: "Geist", fontSize: 11, color: "#A1A1AA", marginTop: 4 }}>watched {dur}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
