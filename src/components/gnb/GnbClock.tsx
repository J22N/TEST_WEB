import { useClock } from '@/hooks/useClock';
import { formatKoTime, formatShortDate } from '@/utils/date';
import styles from './Gnb.module.css';

export function GnbClock() {
  const now = useClock();
  return (
    <time className={styles.clock} dateTime={now.toISOString()}>
      <span>{formatShortDate(now)}</span>
      <span>{formatKoTime(now)}</span>
    </time>
  );
}
