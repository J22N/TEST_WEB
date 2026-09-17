import { Icon, type IconName } from '@/components/common/Icon';
import styles from './Gnb.module.css';

interface GnbIconButtonProps {
  icon: IconName;
  label: string;
  variant?: 'outline' | 'filled';
  badgeCount?: number;
  onClick?: () => void;
}

export function GnbIconButton({ icon, label, variant = 'filled', badgeCount, onClick }: GnbIconButtonProps) {
  return (
    <button type="button" className={styles.iconButton} data-variant={variant} aria-label={label} onClick={onClick}>
      <Icon name={icon} size={20} />
      {badgeCount !== undefined && badgeCount > 0 && <span className={styles.countBadge}>{badgeCount}</span>}
    </button>
  );
}
