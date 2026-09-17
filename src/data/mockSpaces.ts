import type { MenuItem, Space, TableData } from '@/types';

const SAMPLE_MENUS: MenuItem[] = [
  { name: '메뉴이름최대8자', quantity: 24 },
  { name: '메뉴명', quantity: 1 },
  { name: '추가메뉴', quantity: 2 },
];

const ordered = (base: Omit<TableData, 'state' | 'shape'>, shape: TableData['shape'] = 'square'): TableData => ({
  ...base,
  shape,
  state: 'ordered',
  usedMinutes: 42,
  menus: SAMPLE_MENUS,
  totalPrice: 128_000,
});

const HALL_1F: TableData[] = [
  { id: 't1', name: '1번', shape: 'square', state: 'ordering', col: 1, row: 1 },
  ordered({ id: 't5', name: '5번', col: 3, row: 1 }),
  { id: 't6', name: '6번', shape: 'square', state: 'ordering', col: 4, row: 1 },
  ordered({ id: 't9', name: '9번', col: 6, row: 1 }),
  { id: 't10', name: '10번', shape: 'square', state: 'default', col: 7, row: 1 },

  { id: 't2', name: '2번', shape: 'square', state: 'ordering', col: 1, row: 2 },
  { ...ordered({ id: 't7', name: '7번', col: 3, row: 2 }), state: 'neworder' },
  { id: 't8', name: '8번', shape: 'square', state: 'default', col: 4, row: 2 },
  { id: 't11', name: '11번', shape: 'square', state: 'default', col: 6, row: 2 },
  ordered({ id: 't12', name: '12번', col: 7, row: 2 }),

  ordered({ id: 't3', name: '3번', col: 1, row: 3 }),

  { id: 't4', name: '4번', shape: 'square', state: 'default', col: 1, row: 4 },
  { id: 't13', name: '13번', shape: 'round', state: 'ordering', col: 3, row: 4, groupId: 'g-demo', groupColor: 'purple' },
  { id: 't14', name: '14번', shape: 'round', state: 'default', col: 4, row: 4, groupId: 'g-demo', groupColor: 'purple' },
  { id: 't15', name: '15번', shape: 'round', state: 'neworder', col: 6, row: 4 },
  { id: 't16', name: '16번', shape: 'round', state: 'ordered', col: 7, row: 4, usedMinutes: 15 },
];

export const MOCK_SPACES: Space[] = [
  { id: 's1', name: '1층 홀', columns: 8, tables: HALL_1F },
  { id: 's2', name: '1층 룸', columns: 8, tables: [] },
  { id: 's3', name: '2층 홀', columns: 8, tables: [] },
];
