import { useRef } from 'react';
import { useFitScale } from '@/hooks/useFitScale';
import type { DragState } from '@/hooks/useTableDrag';
import type { TableData } from '@/types';
import { DragGhost } from './DragGhost';
import { TableCard, type TableCardProps } from './TableCard';
import styles from './TableGrid.module.css';

/** 카드 140px, 열 간격 4px (Figma 기준) */
const TABLE_SIZE = 140;
const COLUMN_GAP = 4;

interface TableGridProps {
  tables: TableData[];
  columns: number;
  drag?: DragState | null;
  getCardProps: (table: TableData) => Omit<TableCardProps, 'table'>;
}

export function TableGrid({ tables, columns, drag = null, getCardProps }: TableGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const designWidth = columns * TABLE_SIZE + (columns - 1) * COLUMN_GAP;
  const scale = useFitScale(wrapperRef, designWidth);
  const dragTable = drag ? tables.find((t) => t.id === drag.sourceId) : undefined;

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, var(--table-size))`, zoom: scale }}
      >
        {tables.map((table) => (
          <div key={table.id} className={styles.cell} style={{ gridColumn: table.col, gridRow: table.row }}>
            <TableCard table={table} {...getCardProps(table)} />
          </div>
        ))}
      </div>
      {drag && dragTable && <DragGhost drag={drag} table={dragTable} scale={scale} />}
    </div>
  );
}
