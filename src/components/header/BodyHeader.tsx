import { Icon } from '@/components/common/Icon';
import type { Space } from '@/types';
import { SpaceTab } from './SpaceTab';
import styles from './BodyHeader.module.css';

interface BodyHeaderProps {
  spaces: Space[];
  activeSpaceId: string;
  onSpaceChange: (id: string) => void;
  onEditSpace?: () => void;
}

export function BodyHeader({ spaces, activeSpaceId, onSpaceChange, onEditSpace }: BodyHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.tabs} role="tablist" aria-label="공간">
        {spaces.map((space) => (
          <SpaceTab
            key={space.id}
            label={space.name}
            selected={space.id === activeSpaceId}
            onClick={() => onSpaceChange(space.id)}
          />
        ))}
      </div>
      <button type="button" className={styles.editButton} onClick={onEditSpace}>
        <Icon name="layers" size={20} />
        공간 편집
      </button>
    </div>
  );
}
