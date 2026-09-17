export type TableActionType = 'move' | 'merge' | 'group' | 'ungroup';

export type TableAction =
  /** 자리 이동: 빈 테이블로 세션 이동 */
  | { type: 'move'; sourceId: string; targetId: string }
  /** 합석: 두 테이블 주문을 대상 테이블 하나로 합침 */
  | { type: 'merge'; sourceId: string; targetId: string }
  /** 단체 지정: 여러 테이블을 한 그룹으로 묶음 (각 테이블 주문 유지) */
  | { type: 'group'; tableIds: string[] }
  /** 그룹 해제 */
  | { type: 'ungroup'; groupId: string };

/** 사용자가 대상을 고르는 중인 상태 */
export type PendingAction =
  | { mode: 'move'; sourceId: string; targetId: string | null }
  | { mode: 'merge'; sourceId: string; targetId: string | null }
  /** 주문 있는 테이블에 드롭: 합석 / 단체 지정 중 선택 */
  | { mode: 'join'; sourceId: string; targetId: string }
  /** 단체 지정 다중 선택 */
  | { mode: 'group'; sourceId: string; memberIds: string[] };

export type PendingMode = PendingAction['mode'];

/** 카드에 표시할 드롭/선택 미리보기 */
export type DropHint = 'move' | 'merge' | 'join' | 'group';
