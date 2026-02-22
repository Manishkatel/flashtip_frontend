"use client";
import { useAuth } from "@/components/AuthWrapper";
import { StatCard } from "@/components/StatCard";
import { TimelineChart } from "@/components/TimeLineChart";
import { RecentTips } from "@/components/RecentTips";
import { WeeklyChart } from "@/components/WeeklyChart";
import { TopVideos } from "@/components/TopVideos";
import { AIFloatingChat } from "@/components/AIChat";
import { mist, white, line, ink, stone, plum, coral, sky, gold, sage } from "@/lib/theme";
import { TIMELINE_DATA, WEEKLY } from "@/lib/mockData";

export default function Dashboard() {
  const { analyticsData, channelName, logout } = useAuth();
  if (!analyticsData) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Geist, sans-serif", color: stone }}>Loading...</div>;
  }

  const { overview, videoBreakdown, rawTips } = analyticsData;

  const hour        = new Date().getHours();
  const greeting    = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const displayName = channelName || overview?.channelName || "Creator";
  const initials    = displayName.substring(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: mist, fontFamily: "Geist, sans-serif" }}>

      {/* ── Sticky top navbar ─────────────────────────────────────────── */}
      <div style={{
        background: white, borderBottom: `1px solid ${line}`,
        padding: "0 28px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 99,
      }}>
        {/* Left: logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9,
            background: `linear-gradient(135deg, ${plum}, ${coral})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>⚡</div>
          <span style={{ fontFamily: "Geist", fontSize: 15, fontWeight: 700, color: ink }}>FlashTip</span>
        </div>
        {/* Right: live dot + channel avatar + sign-out */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: sage, boxShadow: `0 0 0 2px ${sage}35` }} />
            <span style={{ fontFamily: "Geist", fontSize: 12, color: stone }}>Live</span>
          </div>
          <div style={{ width: 1, height: 16, background: line, margin: "0 4px" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: `${plum}20`, border: `1px solid ${plum}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Geist Mono", fontSize: 12, fontWeight: 700, color: plum,
            }}>{initials}</div>
            <button onClick={logout} style={{
              fontFamily: "Geist", fontSize: 12, color: stone,
              background: "transparent", border: "none", cursor: "pointer",
              padding: "4px 6px", borderRadius: 6, transition: "color 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = ink}
              onMouseLeave={e => e.currentTarget.style.color = stone}
            >Sign out</button>
          </div>
        </div>
      </div>

      {/* ── Page content ──────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 80px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "Geist", fontSize: 24, fontWeight: 700, color: ink, margin: 0 }}>
            {greeting}, {displayName} 👋
          </h1>
          <p style={{ fontFamily: "Geist", fontSize: 14, color: stone, marginTop: 5, marginBottom: 0 }}>
            Here's what's been happening with your channel.
          </p>
        </div>

        {/* 4-column stat cards — data from overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
          <StatCard label="Total SOL earned"        rawValue={overview?.totalSolEarned || 0}            prefix="◎ " decimals={2} accent={plum}  note="All time"           delta={12}  />
          <StatCard label="Tips received"           rawValue={overview?.totalTipsReceived || 0}          accent={coral} note="All time"           delta={8}   />
          <StatCard label="Views on tipped videos"  rawValue={overview?.totalViewsOnTippedVideos || 0}   accent={sky}   note="Across all content" />
          <StatCard label="Average tip"             rawValue={overview?.averageTipAmount || 0}           prefix="◎ " decimals={3} accent={gold}  note="Per transaction"   delta={-3}  />
        </div>

        {/* Full-width timeline chart */}
        <div style={{ marginBottom: 18 }}>
          <TimelineChart data={TIMELINE_DATA} />
        </div>

        {/* Two-column lower section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18 }}>
          {/* Left: recent tips feed — data from rawTips */}
          <RecentTips tips={rawTips || []} />
          {/* Right: weekly bar chart + top videos stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <WeeklyChart data={WEEKLY} />
            <TopVideos videos={videoBreakdown || []} />
          </div>
        </div>
      </div>

      {/* Floating AI chat button (bottom-right) */}
      <AIFloatingChat />

      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; background: #F4F4F5; }
        button:focus { outline: none; }
      `}</style>
    </div>
  );
}
