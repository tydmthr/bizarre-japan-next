"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * localStorage に Set<string> を JSON 配列として保存する hook。
 * Visited / Wishlist 用。
 */
export function useLocalSet(key: string) {
  const [set, setSet] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setSet(new Set(arr));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [key]);

  const has = useCallback((id: string) => set.has(id), [set]);

  const toggle = useCallback(
    (id: string) => {
      setSet((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        try {
          localStorage.setItem(key, JSON.stringify([...next]));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key],
  );

  const clear = useCallback(() => {
    setSet(new Set());
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }, [key]);

  return { set, has, toggle, clear, hydrated, size: set.size };
}
