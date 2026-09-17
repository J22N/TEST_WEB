import { useCallback, useEffect, useRef, useState } from 'react';

export interface ToastData {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

const DURATION_MS = 5000;

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<number>(0);

  const dismiss = useCallback(() => {
    window.clearTimeout(timer.current);
    setToast(null);
  }, []);

  const show = useCallback(
    (message: string, action?: ToastData['action']) => {
      window.clearTimeout(timer.current);
      setToast({ id: Date.now(), message, action });
      timer.current = window.setTimeout(() => setToast(null), DURATION_MS);
    },
    [],
  );

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return { toast, show, dismiss };
}
