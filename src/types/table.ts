/** 테이블 이용 상태 (Figma `table` 컴포넌트 `state` 변형) */
export type TableState =
  | 'default'
  | 'ordering'
  | 'ordered'
  | 'neworder'
  | 'bellring_beforeorder'
  | 'bellring_afterorder';

export type TableShape = 'square' | 'round';

export type GroupColor = 'purple' | 'green';

export interface MenuItem {
  name: string;
  quantity: number;
}

export interface TableData {
  id: string;
  name: string;
  shape: TableShape;
  state: TableState;
  /** 1-based grid position */
  col: number;
  row: number;
  /** 첫 주문 이후 경과 시간(분) */
  usedMinutes?: number;
  menus?: MenuItem[];
  totalPrice?: number;
  /** 단체 그룹. 같은 groupId끼리 묶임 */
  groupId?: string;
  groupColor?: GroupColor;
}
