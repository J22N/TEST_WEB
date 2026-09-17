import { Icon } from '@/components/common/Icon';
import type { TableState } from '@/types';
import { formatMinutes } from '@/utils/format';
import { isBellRinging } from '@/utils/table';
import styles from './OrderStateBadge.module.css';

interface OrderStateBadgeProps {
  state: TableState;
  usedMinutes?: number;
}

/** 테이블 카드 머리에 붙는 상태 뱃지 (주문 중 / 새 주문 / 이용시간 / 호출) */
export function OrderStateBadge({ state, usedMinutes = 0 }: OrderStateBadgeProps) {
  if (isBellRinging(state)) {
    return (
      <span className={styles.badge} data-kind="bellring">
        <Icon name="bellRing" size={10} />
        호출
      </span>
    );
  }

  switch (state) {
    case 'ordering':
      return <span className={styles.badge} data-kind="ordering">주문 중</span>;
    case 'neworder':
      return <span className={styles.badge} data-kind="neworder">새 주문</span>;
    case 'ordered':
      return (
        <span className={styles.badge} data-kind="elapsed">
          <Icon name="clock3" size={10} />
          {formatMinutes(usedMinutes)}
        </span>
      );
    default:
      return null;
  }
}
