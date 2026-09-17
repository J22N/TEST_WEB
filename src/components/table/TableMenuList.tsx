import type { MenuItem } from '@/types';
import { TableMenuItem } from './TableMenuItem';
import styles from './TableMenuList.module.css';

const MAX_VISIBLE = 2;

interface TableMenuListProps {
  menus: MenuItem[];
}

/** 최대 2개 메뉴 + "외 N개" */
export function TableMenuList({ menus }: TableMenuListProps) {
  const visible = menus.slice(0, MAX_VISIBLE);
  const rest = menus.length - visible.length;

  return (
    <ul className={styles.list}>
      {visible.map((menu) => (
        <TableMenuItem key={menu.name} {...menu} />
      ))}
      {rest > 0 && (
        <li className={styles.more}>
          <span>+</span>
          <span>외 {rest}개</span>
        </li>
      )}
    </ul>
  );
}
