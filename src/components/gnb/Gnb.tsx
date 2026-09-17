import { GnbClock } from './GnbClock';
import { GnbIconButton } from './GnbIconButton';
import { GnbMenuButton } from './GnbMenuButton';
import styles from './Gnb.module.css';

export type GnbMenuKey = 'table' | 'order' | 'orderList' | 'store' | 'report';

interface GnbMenu {
  key: GnbMenuKey;
  label: string;
  locked?: boolean;
}

const MENUS: GnbMenu[] = [
  { key: 'table', label: '테이블' },
  { key: 'order', label: '주문 넣기' },
  { key: 'orderList', label: '주문 보기' },
  { key: 'store', label: '매장 관리', locked: true },
  { key: 'report', label: '리포트', locked: true },
];

interface GnbProps {
  activeMenu: GnbMenuKey;
  notificationCount?: number;
  onMenuChange?: (key: GnbMenuKey) => void;
}

export function Gnb({ activeMenu, notificationCount = 0, onMenuChange }: GnbProps) {
  return (
    <header className={styles.gnb}>
      <nav className={styles.left} aria-label="주 메뉴">
        <GnbIconButton icon="home" label="홈" variant="outline" />
        {MENUS.map((menu) => (
          <GnbMenuButton
            key={menu.key}
            label={menu.label}
            locked={menu.locked}
            selected={menu.key === activeMenu}
            onClick={() => onMenuChange?.(menu.key)}
          />
        ))}
      </nav>
      <div className={styles.right}>
        <GnbIconButton icon="bell" label="알림" badgeCount={notificationCount} />
        <GnbClock />
        <GnbIconButton icon="ellipsisVertical" label="더보기" />
      </div>
    </header>
  );
}
