import styles from './Scrim.module.css';

/** 대상 선택 모드에서 배경을 어둡게 하는 레이어. 클릭 시 취소 */
export function Scrim({ onClick }: { onClick?: () => void }) {
  return <div className={styles.scrim} onClick={onClick} aria-hidden />;
}
