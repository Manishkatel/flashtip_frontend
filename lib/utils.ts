export function timeAgo(isoString: string) {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Formats a raw second count into mm:ss display (e.g. 872 → "14:32")
export function fmtDuration(secs: number | null | undefined) {
  if (!secs) return null;
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
}

// Truncates a Solana wallet address to a readable short form (e.g. "7xKp...sY4m")
export function shortAddr(addr: string | null | undefined) {
  if (!addr) return "???";
  return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
}
