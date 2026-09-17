import type { PendingAction, TableData } from '@/types';
import { ACTION_LABEL } from '@/utils/tableActions';
import styles from './ActionPanel.module.css';

interface ActionPanelProps {
  pending: PendingAction;
  tables: TableData[];
  onConfirm: (choice?: 'merge' | 'group') => void;
  onCancel: () => void;
}

const PROMPT: Record<'move' | 'merge' | 'group', string> = {
  move: '이동할 빈 테이블을 선택하세요.',
  merge: '합석할 테이블을 선택하세요.',
  group: '함께 묶을 테이블을 선택하세요.',
};

/** 대상 선택 안내 + 확정 버튼 (화면 상단 중앙) */
export function ActionPanel({ pending, tables, onConfirm, onCancel }: ActionPanelProps) {
  const name = (id: string | null) => tables.find((t) => t.id === id)?.name ?? '';
  const targetGrouped = pending.mode === 'join' && !!tables.find((t) => t.id === pending.targetId)?.groupId;

  const renderBody = () => {
    switch (pending.mode) {
      case 'move':
      case 'merge': {
        const label = ACTION_LABEL[pending.mode];
        const picked = pending.targetId !== null;
        return (
          <>
            <Subtitle highlight={picked}>{picked ? `${name(pending.targetId)} 테이블로 ${label}` : PROMPT[pending.mode]}</Subtitle>
            <button type="button" className={styles.confirm} disabled={!picked} onClick={() => onConfirm()}>
              {label}
            </button>
            <p className={styles.hint}>테이블을 끌어서 다른 테이블 위에 놓아도 돼요</p>
          </>
        );
      }
      case 'join':
        return (
          <>
            <Subtitle highlight>{name(pending.targetId)} 테이블과 어떻게 할까요?</Subtitle>
            <div className={styles.choices}>
              <ChoiceButton title="합석" desc="한 테이블로 합치기" onClick={() => onConfirm('merge')} />
              <ChoiceButton
                title={targetGrouped ? '단체에 추가' : '단체 지정'}
                desc="테이블은 그대로, 함께 묶기"
                onClick={() => onConfirm('group')}
              />
            </div>
          </>
        );
      case 'group': {
        const count = pending.memberIds.length;
        return (
          <>
            <Subtitle highlight={count > 0}>{count > 0 ? `${count}개 테이블 선택됨` : PROMPT.group}</Subtitle>
            <button type="button" className={styles.confirm} disabled={count === 0} onClick={() => onConfirm()}>
              {ACTION_LABEL.group}
            </button>
            <p className={styles.hint}>여러 개 선택할 수 있어요. 다시 누르면 해제</p>
          </>
        );
      }
    }
  };

  return (
    <section className={styles.panel} role="dialog" aria-labelledby="action-panel-title">
      <div className={styles.head}>
        <h2 id="action-panel-title" className={styles.title}>
          {name(pending.sourceId)} 테이블 →
        </h2>
        <button type="button" className={styles.close} aria-label="취소" onClick={onCancel}>
          ✕
        </button>
      </div>
      {renderBody()}
    </section>
  );
}

function Subtitle({ highlight, children }: { highlight: boolean; children: React.ReactNode }) {
  return (
    <p className={styles.subtitle} data-highlight={highlight}>
      {children}
    </p>
  );
}

function ChoiceButton({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.choice} onClick={onClick}>
      <strong>{title}</strong>
      <span>{desc}</span>
    </button>
  );
}
