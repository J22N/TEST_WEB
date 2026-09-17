import { useCallback, useEffect, useState } from 'react';
import { Scrim } from '@/components/common/Scrim';
import { Toast } from '@/components/common/Toast';
import { Gnb, type GnbMenuKey } from '@/components/gnb/Gnb';
import { BodyHeader } from '@/components/header/BodyHeader';
import { ActionPanel, TableActionBar, TableGrid } from '@/components/table';
import { MOCK_SPACES } from '@/data/mockSpaces';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import { useSpaces } from '@/hooks/useSpaces';
import { useTableActions } from '@/hooks/useTableActions';
import { useTableDrag } from '@/hooks/useTableDrag';
import { useTableSelection } from '@/hooks/useTableSelection';
import { useToast } from '@/hooks/useToast';
import type { DropHint, TableAction, TableData } from '@/types';
import { describeActionDone, getDropMode, hasSession } from '@/utils/tableActions';
import styles from './TablePage.module.css';

export function TablePage() {
  const [activeMenu, setActiveMenu] = useState<GnbMenuKey>('table');
  const [activeSpaceId, setActiveSpaceId] = useState(MOCK_SPACES[0].id);

  const { spaces, apply, undo } = useSpaces(MOCK_SPACES);
  const space = spaces.find((s) => s.id === activeSpaceId) ?? spaces[0];
  const { tables } = space;
  const byId = (id: string | null | undefined) => tables.find((t) => t.id === id);

  const selection = useTableSelection();
  const { toast, show: showToast, dismiss: dismissToast } = useToast();

  const commit = useCallback(
    (action: TableAction) => {
      apply(space.id, action);
      selection.clear();
      showToast(describeActionDone(action, tables), {
        label: '되돌리기',
        onClick: () => {
          undo();
          dismissToast();
        },
      });
    },
    [apply, dismissToast, selection, showToast, space.id, tables, undo],
  );

  const actions = useTableActions({ tables, onCommit: commit });
  const { pending } = actions;

  // 대상 선택 패널과 토스트가 같은 자리에 뜨므로, 패널이 열리면 토스트는 닫는다
  useEffect(() => {
    if (pending) dismissToast();
  }, [pending, dismissToast]);

  const drag = useTableDrag({
    canDrag: (id) => {
      const table = byId(id);
      if (!table || !hasSession(table)) return false;
      return !pending || ((pending.mode === 'move' || pending.mode === 'merge') && pending.sourceId === id);
    },
    onDrop: (sourceId, targetId) => {
      if (targetId) actions.startWithTarget(sourceId, targetId);
    },
  });

  useEscapeKey(pending ? actions.cancel : selection.selectedId ? selection.clear : null);

  const handleCardClick = (id: string) => {
    if (drag.consumeClick()) return;
    if (pending) {
      actions.pickTarget(id);
      return;
    }
    selection.toggle(id);
  };

  const handleSpaceChange = (id: string) => {
    setActiveSpaceId(id);
    selection.clear();
    actions.cancel();
  };

  const dropHintFor = (table: TableData): DropHint | null => {
    if (drag.drag?.overId === table.id) {
      const source = byId(drag.drag.sourceId);
      return source ? getDropMode(source, table) : null;
    }
    return actions.hintFor(table);
  };

  const selectedTable = byId(selection.selectedId);

  return (
    <div className={styles.page}>
      <Gnb activeMenu={activeMenu} notificationCount={2} onMenuChange={setActiveMenu} />
      <main className={styles.body}>
        <BodyHeader spaces={spaces} activeSpaceId={space.id} onSpaceChange={handleSpaceChange} />
        <section className={styles.container} data-picking={!!pending} aria-label={`${space.name} 테이블`}>
          <TableGrid
            tables={tables}
            columns={space.columns}
            drag={drag.drag}
            getCardProps={(table) => ({
              selected: table.id === selection.selectedId || table.id === pending?.sourceId,
              dimmed: !actions.isEligible(table),
              dragging: drag.drag?.sourceId === table.id,
              dropHint: dropHintFor(table),
              onSelect: handleCardClick,
              pointerHandlers: drag.getHandlers(table.id),
            })}
          />
        </section>
      </main>

      {pending && <Scrim onClick={actions.cancel} />}
      {pending && <ActionPanel pending={pending} tables={tables} onConfirm={actions.confirm} onCancel={actions.cancel} />}
      {!pending && selectedTable && (
        <TableActionBar
          table={selectedTable}
          onStart={(mode) => actions.start(selectedTable.id, mode)}
          onUngroup={(groupId) => commit({ type: 'ungroup', groupId })}
          onClose={selection.clear}
        />
      )}
      {toast && <Toast toast={toast} />}
    </div>
  );
}
