import { useCallback, useState } from 'react';
import type { DropHint, PendingAction, TableAction, TableData } from '@/types';
import { canGroupWith, canMergeInto, canMoveTo, getDropMode } from '@/utils/tableActions';

interface Options {
  tables: TableData[];
  onCommit: (action: TableAction) => void;
}

/** 자리 이동 / 합석 / 단체 지정 진행 상태 (대상 선택 → 확정) */
export function useTableActions({ tables, onCommit }: Options) {
  const [pending, setPending] = useState<PendingAction | null>(null);
  const byId = useCallback((id: string | null) => tables.find((t) => t.id === id), [tables]);

  /** 액션바 버튼으로 시작 (대상 미정) */
  const start = useCallback((sourceId: string, mode: 'move' | 'merge' | 'group') => {
    setPending(mode === 'group' ? { mode, sourceId, memberIds: [] } : { mode, sourceId, targetId: null });
  }, []);

  /** 드롭으로 시작 (대상 확정). 빈 테이블 → 자리 이동, 이용 중 → 합석/단체 선택 */
  const startWithTarget = useCallback(
    (sourceId: string, targetId: string) => {
      const source = byId(sourceId);
      const target = byId(targetId);
      const mode = source && target ? getDropMode(source, target) : null;
      if (mode) setPending({ mode, sourceId, targetId });
    },
    [byId],
  );

  /** 대상 선택 중 후보인지 */
  const isEligible = useCallback(
    (table: TableData) => {
      if (!pending) return true;
      const source = byId(pending.sourceId);
      if (!source || table.id === source.id) return true;
      switch (pending.mode) {
        case 'move':
          return canMoveTo(source, table);
        case 'merge':
          return canMergeInto(source, table);
        case 'group':
          return canGroupWith(source, table);
        case 'join':
          return table.id === pending.targetId;
      }
    },
    [byId, pending],
  );

  const pickTarget = useCallback(
    (id: string) => {
      const table = byId(id);
      if (!table || !isEligible(table)) return;
      setPending((p) => {
        if (!p || p.sourceId === id) return p;
        if (p.mode === 'group') {
          const memberIds = p.memberIds.includes(id) ? p.memberIds.filter((m) => m !== id) : [...p.memberIds, id];
          return { ...p, memberIds };
        }
        if (p.mode === 'join') return p;
        return { ...p, targetId: p.targetId === id ? null : id };
      });
    },
    [byId, isEligible],
  );

  const cancel = useCallback(() => setPending(null), []);

  /** join 모드에서는 합석/단체 중 하나를 골라 확정 */
  const confirm = useCallback(
    (choice?: 'merge' | 'group') => {
      if (!pending) return;
      let action: TableAction | null = null;
      switch (pending.mode) {
        case 'move':
        case 'merge':
          if (pending.targetId) action = { type: pending.mode, sourceId: pending.sourceId, targetId: pending.targetId };
          break;
        case 'join':
          action =
            choice === 'group'
              ? { type: 'group', tableIds: [pending.sourceId, pending.targetId] }
              : { type: 'merge', sourceId: pending.sourceId, targetId: pending.targetId };
          break;
        case 'group':
          if (pending.memberIds.length > 0) action = { type: 'group', tableIds: [pending.sourceId, ...pending.memberIds] };
          break;
      }
      if (!action) return;
      onCommit(action);
      setPending(null);
    },
    [onCommit, pending],
  );

  /** 현재 선택된 대상 카드에 표시할 미리보기 */
  const hintFor = useCallback(
    (table: TableData): DropHint | null => {
      if (!pending) return null;
      if (pending.mode === 'group') return pending.memberIds.includes(table.id) ? 'group' : null;
      return pending.targetId === table.id ? pending.mode : null;
    },
    [pending],
  );

  return { pending, start, startWithTarget, pickTarget, cancel, confirm, isEligible, hintFor };
}
