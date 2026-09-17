import { useCallback, useReducer } from 'react';
import type { Space, TableAction } from '@/types';
import { applyTableAction } from '@/utils/tableActions';

interface State {
  spaces: Space[];
  history: Space[][];
}

type Event = { kind: 'apply'; spaceId: string; action: TableAction } | { kind: 'undo' };

const MAX_HISTORY = 20;

function reducer(state: State, event: Event): State {
  switch (event.kind) {
    case 'apply': {
      const spaces = state.spaces.map((space) =>
        space.id === event.spaceId ? { ...space, tables: applyTableAction(space.tables, event.action) } : space,
      );
      return { spaces, history: [...state.history.slice(-MAX_HISTORY + 1), state.spaces] };
    }
    case 'undo': {
      const previous = state.history.at(-1);
      if (!previous) return state;
      return { spaces: previous, history: state.history.slice(0, -1) };
    }
  }
}

/** 공간/테이블 상태 + 실행 취소 */
export function useSpaces(initial: Space[]) {
  const [state, dispatch] = useReducer(reducer, { spaces: initial, history: [] });

  const apply = useCallback((spaceId: string, action: TableAction) => dispatch({ kind: 'apply', spaceId, action }), []);
  const undo = useCallback(() => dispatch({ kind: 'undo' }), []);

  return { spaces: state.spaces, apply, undo, canUndo: state.history.length > 0 };
}
