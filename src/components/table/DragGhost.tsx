import { createPortal } from 'react-dom';
import type { DragState } from '@/hooks/useTableDrag';
import type { TableData } from '@/types';
import { TableCard } from './TableCard';
import styles from './DragGhost.module.css';

interface DragGhostProps {
  drag: DragState;
  table: TableData;
  /** 그리드에 적용된 zoom 배율 */
  scale: number;
}

/** 포인터를 따라다니는 드래그 중 카드 사본 */
export function DragGhost({ drag, table, scale }: DragGhostProps) {
  return createPortal(
    <div className={styles.ghost} style={{ left: drag.x - drag.offsetX, top: drag.y - drag.offsetY }} aria-hidden>
      <div style={{ zoom: scale }}>
        <TableCard table={table} />
      </div>
    </div>,
    document.body,
  );
}
