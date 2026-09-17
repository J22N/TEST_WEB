import { useCallback, useState } from 'react';

/** 한 번에 한 테이블만 선택 가능 (재클릭 시 해제) */
export function useTableSelection() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const clear = useCallback(() => setSelectedId(null), []);

  return { selectedId, toggle, clear };
}
