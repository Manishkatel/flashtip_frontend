"use client";
import { useState, useEffect } from "react";

export function useCounter(target: number | string, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const end = parseFloat(String(target)) || 0;
    const dur = 1000;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4); // ease-out quartic
      setVal(+(e * end).toFixed(decimals));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, decimals]);
  return val;
}

