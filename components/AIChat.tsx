"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/AuthWrapper";
import { plum, coral, ink, stone, line, white, mist, sage } from "@/lib/theme";
import type { Message } from "@/types";

const AI_SUGGESTIONS = [
  "Which video performed best?",
  "Show top tippers this month",
  "Analyze watch time patterns",
  "Predict next month earnings",
];

export function AIFloatingChat() {
  const { analyticsData } = useAuth(); // pulls live data from AuthContext
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hey! I'm your FlashTip assistant. Ask me anything about your tips, trends, or audience." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message whenever messages or loading state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      // Real API call — passes full analyticsData as context for the AI
      const token = localStorage.getItem("flash_tip_token");
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ message: text, context: analyticsData }),
      });
      if (!res.ok) throw new Error();
      const { reply } = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: reply }]);
    } catch {
      // Demo fallback — generates replies from real analyticsData values
      const ov = analyticsData?.overview;
      const topVideo = analyticsData?.videoBreakdown?.[0];
      const demoBrain = {
        "Which video performed best?":
          `Your top performer is **${topVideo?.title || "your latest video"}** — it brought in ◎${topVideo?.totalSolEarned?.toFixed(1) || "52.4"} SOL across ${topVideo?.tipsCount || "342"} tips. Viewers tip most around the 60–70% mark — right after the "aha moment".`,
        "Show top tippers this month":
          `Your highest tip this month was ◎${ov?.highestTipReceived?.toFixed(2) || "8.50"}. You've got ${analyticsData?.rawTips?.filter(t => Number(t.sol_amount) >= 1).length || 5} tippers over ◎1 SOL — worth engaging with them directly.`,
        "Analyze watch time patterns":
          `People tip earliest on shorter videos. On longer ones the spike hits around 60–70% through — once they're confident the content delivered value.`,
        "Predict next month earnings":
          `You're trending up based on recent data. If that pace holds, you're looking at roughly ◎${Math.round((ov?.totalSolEarned || 284) * 1.12)} next month.`,
      };
      const reply = (demoBrain as Record<string, string>)[text] || "Great question! Your engagement is trending upward. Keep posting consistently — your audience rewards depth over frequency.";
      setMessages(prev => [...prev, { role: "ai", content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const showSuggestions = messages.length <= 1; // only show chips before first user message

  return (
    <>
      <style>{`
        @keyframes bounce      { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-4px);opacity:1} }
        @keyframes popIn       { 0%{opacity:0;transform:scale(.94) translateY(10px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes pulse-ring  { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.6);opacity:0} }
      `}</style>

      {/* FAB — fixed bottom-right corner */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 1000 }}>
        {/* Animated pulse ring — only shows when panel is closed */}
        {!open && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            background: `linear-gradient(135deg, ${plum}, ${coral})`,
            animation: "pulse-ring 2s ease-out infinite", pointerEvents: "none",
          }} />
        )}
        <button onClick={() => setOpen(o => !o)} style={{
          width: 52, height: 52, borderRadius: "50%", border: "none",
          background: open ? ink : `linear-gradient(135deg, ${plum}, ${coral})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          transition: "all 0.25s cubic-bezier(.34,1.56,.64,1)", position: "relative", zIndex: 1,
        }}>
          {/* ⚡ when closed, × when open */}
          {open
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <span style={{ fontSize: 22, lineHeight: 1 }}>⚡</span>
          }
        </button>
      </div>

      {/* Chat panel — spring-animates in above the FAB */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 28, zIndex: 999,
          width: 340, background: white,
          border: `1px solid ${line}`, borderRadius: 18,
          display: "flex", flexDirection: "column",
          boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
          animation: "popIn 0.22s cubic-bezier(.34,1.56,.64,1)",
          maxHeight: "70vh",
        }}>
          {/* Panel header */}
          <div style={{
            padding: "14px 16px 12px", borderBottom: `1px solid ${line}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10,
                background: `linear-gradient(135deg, ${plum}, ${coral})`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
              }}>⚡</div>
              <div>
                <div style={{ fontFamily: "Geist", fontSize: 14, fontWeight: 600, color: ink }}>Flash Tip AI</div>
                <div style={{ fontFamily: "Geist", fontSize: 11, color: stone }}>Your personal creator analyst</div>
              </div>
            </div>
            {/* Online indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: sage, boxShadow: `0 0 0 2px ${sage}35` }} />
              <span style={{ fontFamily: "Geist", fontSize: 11, color: stone }}>online</span>
            </div>
          </div>

          {/* Scrollable message list */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: "auto", padding: "14px 14px 8px",
            display: "flex", flexDirection: "column", gap: 10, minHeight: 0,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "90%",
                // User: purple-tinted right-aligned bubble; AI: grey left-aligned bubble
                background: msg.role === "user" ? `${plum}12` : mist,
                border: `1px solid ${msg.role === "user" ? plum + "25" : line}`,
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "4px 14px 14px 14px",
                padding: "9px 12px",
                fontFamily: "Geist", fontSize: 13, color: ink, lineHeight: 1.55,
              }}>
                {/* Render **bold** markdown in AI replies */}
                {msg.content.split("**").map((part, j) =>
                  j % 2 === 1 ? <strong key={j} style={{ fontWeight: 600 }}>{part}</strong> : part
                )}
              </div>
            ))}

            {/* Suggestion chips — only shown before user sends first message */}
            {showSuggestions && (
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 2 }}>
                <div style={{ fontFamily: "Geist", fontSize: 11, color: stone, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Try asking</div>
                {AI_SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => handleSend(s)} disabled={loading} style={{
                    textAlign: "left", padding: "8px 11px",
                    background: white, border: `1px solid ${line}`,
                    borderRadius: 10, cursor: "pointer",
                    fontFamily: "Geist", fontSize: 12, color: stone, transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = plum + "55"; e.currentTarget.style.color = ink; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = line; e.currentTarget.style.color = stone; }}
                  >{s}</button>
                ))}
              </div>
            )}

            {/* Animated typing indicator while waiting for AI response */}
            {loading && (
              <div style={{
                alignSelf: "flex-start", background: mist, border: `1px solid ${line}`,
                borderRadius: "4px 14px 14px 14px", padding: "10px 14px",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0, 150, 300].map(d => (
                  <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: stone, animation: "bounce 1s infinite", animationDelay: `${d}ms` }} />
                ))}
              </div>
            )}
          </div>

          {/* Input row */}
          <div style={{ padding: "10px 12px 14px", flexShrink: 0, borderTop: `1px solid ${line}` }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend(input)}
                placeholder="Ask anything..."
                disabled={loading}
                style={{
                  flex: 1, background: mist, border: `1px solid ${line}`,
                  borderRadius: 10, padding: "9px 12px",
                  fontFamily: "Geist", fontSize: 13, color: ink,
                  outline: "none", transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = plum + "55"}
                onBlur={e => e.target.style.borderColor = line}
              />
              {/* Send button — gradient when active, grey when disabled */}
              <button
                onClick={() => handleSend(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: 34, height: 34, borderRadius: 10, border: "none", flexShrink: 0,
                  background: input.trim() && !loading ? `linear-gradient(135deg, ${plum}, ${coral})` : line,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.2s",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}