import { useEffect } from 'react';

export function useEscapeKey(handler: (() => void) | null) {
  useEffect(() => {
    if (!handler) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handler]);
}
