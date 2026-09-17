import { Icon } from '@/components/common/Icon';
import styles from './Gnb.module.css';

interface GnbMenuButtonProps {
  label: string;
  selected?: boolean;
  locked?: boolean;
  onClick?: () => void;
}

export function GnbMenuButton({ label, selected = false, locked = false, onClick }: GnbMenuButtonProps) {
  return (
    <button
      type="button"
      className={styles.menuButton}
      data-selected={selected}
      aria-current={selected ? 'page' : undefined}
      onClick={onClick}
    >
      {locked && !selected && (
        <span className={styles.lockBadge}>
          <Icon name="lock" size={12} />
        </span>
      )}
      {label}
    </button>
  );
}
