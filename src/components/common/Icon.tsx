import bell from '@/assets/icons/bell.svg';
import bellRing from '@/assets/icons/bell-ring.svg';
import checkCircle from '@/assets/icons/check-circle.svg';
import clock3 from '@/assets/icons/clock-3.svg';
import ellipsisVertical from '@/assets/icons/ellipsis-vertical.svg';
import home from '@/assets/icons/home.svg';
import layers from '@/assets/icons/layers.svg';
import lock from '@/assets/icons/lock.svg';
import users from '@/assets/icons/users.svg';
import styles from './Icon.module.css';

const ICONS = {
  bell,
  bellRing,
  checkCircle,
  clock3,
  ellipsisVertical,
  home,
  layers,
  lock,
  users,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <span
      className={[styles.icon, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <img src={ICONS[name]} alt="" />
    </span>
  );
}
