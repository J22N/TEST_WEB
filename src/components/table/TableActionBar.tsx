import type { TableData } from '@/types';
import { ACTION_LABEL, hasSession } from '@/utils/tableActions';
import styles from './TableActionBar.module.css';

interface TableActionBarProps {
  table: TableData;
  onStart: (mode: 'move' | 'merge' | 'group') => void;
  onUngroup: (groupId: string) => void;
  onClose: () => void;
}

/** 테이블 선택 시 하단에 뜨는 빠른 동작 바 */
export function TableActionBar({ table, onStart, onUngroup, onClose }: TableActionBarProps) {
  const active = hasSession(table);
  const sub = table.groupId ? '단체 그룹에 속한 테이블이에요' : active ? '끌어서 옮기거나 아래 버튼을 누르세요' : '비어 있는 테이블이에요';

  return (
    <div className={styles.bar} role="toolbar" aria-label={`${table.name} 테이블 동작`}>
      <div className={styles.info}>
        <strong className={styles.name}>{table.name} 테이블</strong>
        <span className={styles.sub}>{sub}</span>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.action} disabled={!active} onClick={() => onStart('move')}>
          {ACTION_LABEL.move}
        </button>
        <button type="button" className={styles.action} disabled={!active} onClick={() => onStart('merge')}>
          {ACTION_LABEL.merge}
        </button>
        <button type="button" className={styles.action} data-variant="group" onClick={() => onStart('group')}>
          {table.groupId ? '단체에 추가' : ACTION_LABEL.group}
        </button>
        {table.groupId && (
          <button type="button" className={styles.action} data-variant="ghost" onClick={() => onUngroup(table.groupId!)}>
            {ACTION_LABEL.ungroup}
          </button>
        )}
        <button type="button" className={styles.close} aria-label="닫기" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
