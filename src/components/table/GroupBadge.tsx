import { Icon } from '@/components/common/Icon';
import type { GroupColor } from '@/types';
import styles from './GroupBadge.module.css';

interface GroupBadgeProps {
  color: GroupColor;
}

/** 단체손님 그룹 표시 (카드 상단 중앙) */
export function GroupBadge({ color }: GroupBadgeProps) {
  return (
    <span className={styles.badge} data-color={color}>
      <Icon name="users" size={10} />
      단체
    </span>
  );
}
