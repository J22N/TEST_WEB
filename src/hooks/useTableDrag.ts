import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

export interface DragState {
  sourceId: string;
  /** 포인터 위치 (client 좌표) */
  x: number;
  y: number;
  /** 카드 좌상단 기준 포인터 오프셋 */
  offsetX: number;
  offsetY: number;
  overId: string | null;
}

interface Options {
  canDrag: (id: string) => boolean;
  onDrop: (sourceId: string, targetId: string | null) => void;
}

const HOLD_MS = 180;
const MOVE_THRESHOLD = 8;
export const TABLE_ID_ATTR = 'data-table-id';

function findTableIdAt(x: number, y: number): string | null {
  const el = document.elementFromPoint(x, y)?.closest<HTMLElement>(`[${TABLE_ID_ATTR}]`);
  return el?.getAttribute(TABLE_ID_ATTR) ?? null;
}

/**
 * 테이블 카드 드래그.
 * - 마우스: 8px 이상 움직이면 시작
 * - 터치/펜: 180ms 누르고 있으면 시작 (스크롤 제스처와 구분)
 */
export function useTableDrag({ canDrag, onDrop }: Options) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const pending = useRef<{ id: string; startX: number; startY: number; el: HTMLElement; pointerId: number; timer: number } | null>(null);
  const didDrag = useRef(false);

  const activate = useCallback((x: number, y: number) => {
    const p = pending.current;
    if (!p) return;
    window.clearTimeout(p.timer);
    pending.current = null;
    didDrag.current = true;
    p.el.setPointerCapture(p.pointerId);
    const rect = p.el.getBoundingClientRect();
    setDrag({ sourceId: p.id, x, y, offsetX: x - rect.left, offsetY: y - rect.top, overId: null });
  }, []);

  const cancelPending = useCallback(() => {
    if (pending.current) window.clearTimeout(pending.current.timer);
    pending.current = null;
  }, []);

  const onPointerDown = useCallback(
    (id: string) => (e: ReactPointerEvent<HTMLElement>) => {
      if (!canDrag(id) || e.button !== 0) return;
      cancelPending();
      const el = e.currentTarget;
      const timer = e.pointerType === 'mouse' ? 0 : window.setTimeout(() => activate(e.clientX, e.clientY), HOLD_MS);
      pending.current = { id, startX: e.clientX, startY: e.clientY, el, pointerId: e.pointerId, timer };
      didDrag.current = false;
    },
    [activate, canDrag, cancelPending],
  );

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const p = pending.current;
      if (p) {
        const moved = Math.hypot(e.clientX - p.startX, e.clientY - p.startY) > MOVE_THRESHOLD;
        if (!moved) return;
        if (e.pointerType === 'mouse') activate(e.clientX, e.clientY);
        else cancelPending();
        return;
      }
      if (!drag) return;
      const overId = findTableIdAt(e.clientX, e.clientY);
      setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY, overId: overId === d.sourceId ? null : overId } : d));
    },
    [activate, cancelPending, drag],
  );

  const onPointerUp = useCallback(() => {
    cancelPending();
    if (!drag) return;
    onDrop(drag.sourceId, drag.overId);
    setDrag(null);
  }, [cancelPending, drag, onDrop]);

  const onPointerCancel = useCallback(() => {
    cancelPending();
    setDrag(null);
  }, [cancelPending]);

  /** 드래그 직후 발생하는 click 무시용 */
  const consumeClick = useCallback(() => {
    const was = didDrag.current;
    didDrag.current = false;
    return was;
  }, []);

  const getHandlers = useCallback(
    (id: string) => ({ onPointerDown: onPointerDown(id), onPointerMove, onPointerUp, onPointerCancel }),
    [onPointerDown, onPointerMove, onPointerUp, onPointerCancel],
  );

  return { drag, getHandlers, consumeClick };
}
