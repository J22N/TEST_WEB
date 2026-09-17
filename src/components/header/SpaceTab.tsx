import styles from './BodyHeader.module.css';

interface SpaceTabProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function SpaceTab({ label, selected, onClick }: SpaceTabProps) {
  return (
    <button type="button" role="tab" aria-selected={selected} className={styles.tab} data-selected={selected} onClick={onClick}>
      <span className={styles.tabLabel}>{label}</span>
      <span className={styles.tabIndicator} />
    </button>
  );
}
