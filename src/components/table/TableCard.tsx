import type { HTMLAttributes } from 'react';
import type { DropHint, TableData } from '@/types';
import { hasOrderDetail } from '@/utils/table';
import { GroupBadge } from './GroupBadge';
import { TableBottom } from './TableBottom';
import { TableHead } from './TableHead';
import { TableMenuList } from './TableMenuList';
import styles from './TableCard.module.css';

export interface TableCardProps {
  table: TableData;
  selected?: boolean;
  /** 대상 선택 중 후보가 아닌 테이블 */
  dimmed?: boolean;
  /** 드래그 중인 원본 */
  dragging?: boolean;
  /** 드롭/선택 시 수행될 동작 미리보기 */
  dropHint?: DropHint | null;
  onSelect?: (id: string) => void;
  pointerHandlers?: Pick<HTMLAttributes<HTMLElement>, 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel'>;
}

export function TableCard({
  table,
  selected = false,
  dimmed = false,
  dragging = false,
  dropHint = null,
  onSelect,
  pointerHandlers,
}: TableCardProps) {
  const { id, name, shape, state, usedMinutes, menus = [], totalPrice = 0, groupColor } = table;
  const showDetail = hasOrderDetail(state, shape);

  return (
    <button
      type="button"
      className={styles.card}
      data-table-id={id}
      data-shape={shape}
      data-selected={selected}
      data-dimmed={dimmed}
      data-dragging={dragging}
      data-drop={dropHint ?? undefined}
      aria-pressed={selected}
      aria-label={`${name} 테이블`}
      onClick={() => onSelect?.(id)}
      {...pointerHandlers}
    >
      <div className={styles.content} data-state={state} data-group={groupColor}>
        <TableHead name={name} state={state} shape={shape} usedMinutes={usedMinutes} />
        {showDetail && <TableMenuList menus={menus} />}
        {showDetail && <TableBottom totalPrice={totalPrice} />}
        {groupColor && <GroupBadge color={groupColor} />}
      </div>
    </button>
  );
}
