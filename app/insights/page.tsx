"use client";
import { useAuth } from "@/components/AuthWrapper";
import { mist, white, line, ink, stone, plum } from "@/lib/theme";

export default function InsightsPage() {
  const { analyticsData, channelName } = useAuth();
  
  if (!analyticsData) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Geist, sans-serif", color: stone }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: mist, fontFamily: "Geist, sans-serif", padding: "28px 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Geist", fontSize: 28, fontWeight: 700, color: ink, marginBottom: 8 }}>
          Insights
        </h1>
        <p style={{ fontFamily: "Geist", fontSize: 14, color: stone, marginBottom: 24 }}>
          Deep analytics and trends for {channelName || "your channel"}
        </p>
        
        <div style={{
          background: white,
          borderRadius: 16,
          border: `1px solid ${line}`,
          padding: "32px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <p style={{ fontFamily: "Geist", fontSize: 14, color: stone }}>
            Insights page coming soon. Use the AI chat assistant (⚡ button) to ask questions about your analytics!
          </p>
        </div>
      </div>
    </div>
  );
}
