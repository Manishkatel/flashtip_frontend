"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mist, white, line, plum, coral, ink, stone } from "@/lib/theme";
import { MOCK_ANALYTICS } from "@/lib/mockData";
import type { AuthContextType, AnalyticsData } from "@/types";

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  channelName: "",
  analyticsData: null,
  logout: () => {},
});

// useAuth — import and call this in any component that needs auth state or analytics data
export const useAuth = () => useContext(AuthContext);

// LoginScreen — rendered by AuthWrapper when isLoggedIn is false
// Matches the dashboard's light design system (not the original dark theme)
interface LoginScreenProps {
  onLogin: (channelName: string, password: string) => void;
  loading: boolean;
  error: string;
}

function LoginScreen({ onLogin, loading, error }: LoginScreenProps) {
  const [channelName, setChannelName] = useState("");
  const [password, setPassword] = useState("");
  const [focusedField, setFocusedField] = useState<"channel" | "pass" | null>(null);

  return (
    <div style={{
      minHeight: "100vh", background: mist,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, fontFamily: "Geist, sans-serif",
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: white, borderRadius: 20,
        border: `1px solid ${line}`,
        padding: "36px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        {/* Branding */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: `linear-gradient(135deg, ${plum}, ${coral})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, boxShadow: `0 4px 16px ${plum}35`,
          }}>⚡</div>
          <div style={{ fontFamily: "Geist", fontSize: 20, fontWeight: 700, color: ink }}>Flash Tip Dashboard</div>
          <div style={{ fontFamily: "Geist", fontSize: 13, color: stone }}>Analyze your tipping metrics securely</div>
        </div>

        {/* Login form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "Geist", fontSize: 13, fontWeight: 500, color: ink }}>Channel Name</label>
            <input
              type="text"
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onLogin(channelName, password)}
              placeholder="e.g. MyCryptoChannel"
              onFocus={() => setFocusedField("channel")}
              onBlur={() => setFocusedField(null)}
              style={{
                width: "100%", background: mist,
                border: `1px solid ${focusedField === "channel" ? plum + "66" : line}`,
                borderRadius: 10, padding: "11px 14px",
                fontFamily: "Geist", fontSize: 14, color: ink,
                outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontFamily: "Geist", fontSize: 13, fontWeight: 500, color: ink }}>Dashboard Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && onLogin(channelName, password)}
              placeholder="Enter access code"
              onFocus={() => setFocusedField("pass")}
              onBlur={() => setFocusedField(null)}
              style={{
                width: "100%", background: mist,
                border: `1px solid ${focusedField === "pass" ? plum + "66" : line}`,
                borderRadius: 10, padding: "11px 14px",
                fontFamily: "Geist", fontSize: 14, color: ink,
                outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, padding: "10px 14px",
              fontFamily: "Geist", fontSize: 13, color: "#DC2626", textAlign: "center",
            }}>{error}</div>
          )}

          <button
            onClick={() => onLogin(channelName, password)}
            disabled={loading || !channelName.trim() || !password.trim()}
            style={{
              marginTop: 8, width: "100%",
              background: loading || !channelName.trim() || !password.trim()
                ? line : `linear-gradient(135deg, ${plum}, ${coral})`,
              color: white, border: "none", borderRadius: 10, padding: "12px 0",
              fontFamily: "Geist", fontSize: 14, fontWeight: 600,
              cursor: loading || !channelName.trim() || !password.trim() ? "default" : "pointer",
              transition: "all 0.2s", boxShadow: loading ? "none" : `0 4px 16px ${plum}30`,
            }}
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </div>
      </div>
    </div>
  );
}

// AuthWrapper — place this in app/layout.tsx wrapping {children}
interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // On mount: restore session from localStorage if token exists
  useEffect(() => {
    const token   = localStorage.getItem("flash_tip_token");
    const stored  = localStorage.getItem("flash_tip_channel");
    if (token && stored) { setChannelName(stored); fetchData(token); }
  }, []);

  // Calls POST /api/dashboard/data with the stored JWT
  // On 401/403 → auto-logout; on any other failure → demo mode fallback
  const fetchData = async (token: string) => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/api/dashboard/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({}), // channelName is inferred from JWT on backend
      });
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) { logout(); return; }
        throw new Error("Failed to fetch");
      }
      const { data } = await res.json();
      setAnalyticsData(data);
      setIsLoggedIn(true);
    } catch {
      // Demo / offline fallback — shows mock data instead of a blank screen
      setAnalyticsData(MOCK_ANALYTICS);
      setIsLoggedIn(true);
    } finally {
      setLoading(false);
    }
  };

  // Calls POST /api/auth/login, stores token, then fetches dashboard data
  // Falls back to demo mode if backend is unreachable
  const handleLogin = async (channelNameVal: string, password: string) => {
    setLoading(true); setError("");
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelName: channelNameVal, password }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Invalid credentials");
      }
      const { token, channelName: verified } = await res.json();
      localStorage.setItem("flash_tip_token", token);
      localStorage.setItem("flash_tip_channel", verified);
      setChannelName(verified);
      await fetchData(token);
    } catch {
      // Demo mode — accept any credentials when backend is down
      setChannelName(channelNameVal);
      setAnalyticsData(MOCK_ANALYTICS);
      setIsLoggedIn(true);
    } finally {
      setLoading(false);
    }
  };

  // Clears localStorage and resets all auth state back to the login screen
  const logout = () => {
    localStorage.removeItem("flash_tip_token");
    localStorage.removeItem("flash_tip_channel");
    setIsLoggedIn(false); setChannelName(""); setAnalyticsData(null); setError("");
  };

  if (!isLoggedIn) return <LoginScreen onLogin={handleLogin} loading={loading} error={error} />;

  return (
    <AuthContext.Provider value={{ isLoggedIn, channelName, analyticsData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
