import type { TableShape, TableState } from '@/types';

const STATES_WITH_ORDER: ReadonlySet<TableState> = new Set([
  'ordered',
  'neworder',
  'bellring_afterorder',
]);

/** 주문 내역(메뉴/금액)이 카드에 표시되는지. 원형 테이블은 공간이 없어 머리만 표시 */
export function hasOrderDetail(state: TableState, shape: TableShape = 'square'): boolean {
  return shape === 'square' && STATES_WITH_ORDER.has(state);
}

export function isBellRinging(state: TableState): boolean {
  return state === 'bellring_beforeorder' || state === 'bellring_afterorder';
}
