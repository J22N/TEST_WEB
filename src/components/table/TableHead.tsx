import type { TableShape, TableState } from '@/types';
import { hasOrderDetail } from '@/utils/table';
import { OrderStateBadge } from './OrderStateBadge';
import styles from './TableCard.module.css';

interface TableHeadProps {
  name: string;
  state: TableState;
  shape: TableShape;
  usedMinutes?: number;
}

/** 테이블명 + 상태 뱃지. 주문 내역이 있으면 가로, 없으면 세로 배치 */
export function TableHead({ name, state, shape, usedMinutes }: TableHeadProps) {
  const compact = hasOrderDetail(state, shape);
  return (
    <div className={styles.head} data-layout={compact ? 'row' : 'column'}>
      <span className={styles.name}>{name}</span>
      <OrderStateBadge state={state} usedMinutes={usedMinutes} />
    </div>
  );
}
