import { useEffect, useRef } from "react";

/**
 * Runs `fn` immediately, then every `ms` milliseconds, until unmounted
 * or `enabled` becomes false. `fn` may be async.
 */
export function usePoll(fn: () => void | Promise<void>, ms: number, enabled: boolean = true): void {
  const savedFn = useRef(fn);
  savedFn.current = fn;

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const tick = () => {
      if (!cancelled) void savedFn.current();
    };

    tick();
    const id = setInterval(tick, ms);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [ms, enabled]);
}
