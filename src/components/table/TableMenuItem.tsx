import type { MenuItem } from '@/types';
import styles from './TableMenuList.module.css';

export function TableMenuItem({ name, quantity }: MenuItem) {
  return (
    <li className={styles.item}>
      <span className={styles.itemName}>{name}</span>
      <span className={styles.dot} />
      <span className={styles.itemQty}>{quantity}</span>
    </li>
  );
}
