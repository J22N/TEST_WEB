import { formatPrice } from '@/utils/format';
import styles from './TableCard.module.css';

export function TableBottom({ totalPrice }: { totalPrice: number }) {
  return (
    <div className={styles.bottom}>
      <span className={styles.total}>{formatPrice(totalPrice)}</span>
    </div>
  );
}
