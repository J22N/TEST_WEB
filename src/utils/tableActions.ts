import type { GroupColor, MenuItem, TableAction, TableActionType, TableData, TableState } from '@/types';

export const ACTION_LABEL: Record<TableActionType, string> = {
  move: '자리 이동',
  merge: '합석',
  group: '단체 지정',
  ungroup: '그룹 해제',
};

/** 손님이 앉아 있는(이용 중인) 테이블인지 */
export function hasSession(table: TableData): boolean {
  return table.state !== 'default';
}

export function isSameGroup(a: TableData, b: TableData): boolean {
  return !!a.groupId && a.groupId === b.groupId;
}

/** source를 target에 드롭했을 때: 빈 테이블 → 자리 이동, 이용 중 → 합석/단체 선택 */
export function getDropMode(source: TableData, target: TableData): 'move' | 'join' | null {
  if (source.id === target.id || !hasSession(source)) return null;
  return hasSession(target) ? 'join' : 'move';
}

export function canMoveTo(source: TableData, target: TableData): boolean {
  return getDropMode(source, target) === 'move';
}

export function canMergeInto(source: TableData, target: TableData): boolean {
  return getDropMode(source, target) === 'join';
}

export function canGroupWith(source: TableData, target: TableData): boolean {
  return source.id !== target.id && !isSameGroup(source, target);
}

/* ---------- 병합 규칙 ---------- */

function mergeMenus(a: MenuItem[], b: MenuItem[]): MenuItem[] {
  const map = new Map<string, number>();
  for (const { name, quantity } of [...a, ...b]) {
    map.set(name, (map.get(name) ?? 0) + quantity);
  }
  return [...map].map(([name, quantity]) => ({ name, quantity }));
}

const STATE_PRIORITY: TableState[] = [
  'bellring_afterorder',
  'bellring_beforeorder',
  'neworder',
  'ordered',
  'ordering',
  'default',
];

function mergeState(a: TableState, b: TableState): TableState {
  return STATE_PRIORITY.find((s) => s === a || s === b) ?? 'default';
}

/** 세션 정보만 비운 빈 테이블 (그룹은 유지) */
function clearSession(table: TableData): TableData {
  const { id, name, shape, col, row, groupId, groupColor } = table;
  return { id, name, shape, col, row, state: 'default', groupId, groupColor };
}

function moveSession(source: TableData, target: TableData): TableData {
  const { id, name, shape, col, row } = target;
  return { ...source, id, name, shape, col, row };
}

function mergeSession(source: TableData, target: TableData): TableData {
  return {
    ...target,
    state: mergeState(source.state, target.state),
    menus: mergeMenus(target.menus ?? [], source.menus ?? []),
    totalPrice: (target.totalPrice ?? 0) + (source.totalPrice ?? 0),
    usedMinutes: Math.max(target.usedMinutes ?? 0, source.usedMinutes ?? 0),
  };
}

/* ---------- 그룹 ---------- */

/** 기존 그룹 수가 적은 색을 배정 */
function pickGroupColor(tables: TableData[]): GroupColor {
  const groups = new Map<string, GroupColor>();
  for (const t of tables) if (t.groupId && t.groupColor) groups.set(t.groupId, t.groupColor);
  const colors = [...groups.values()];
  const purple = colors.filter((c) => c === 'purple').length;
  const green = colors.filter((c) => c === 'green').length;
  return green < purple ? 'green' : 'purple';
}

function groupTables(tables: TableData[], tableIds: string[]): TableData[] {
  const selected = tables.filter((t) => tableIds.includes(t.id));
  if (selected.length < 2) return tables;

  // 선택된 테이블이 속한 기존 그룹은 통째로 합류
  const touchedGroups = new Set(selected.map((t) => t.groupId).filter((g): g is string => !!g));
  const first = selected.find((t) => t.groupId);
  const groupId = first?.groupId ?? `g-${Date.now()}`;
  const groupColor = first?.groupColor ?? pickGroupColor(tables);

  return tables.map((t) =>
    tableIds.includes(t.id) || (t.groupId && touchedGroups.has(t.groupId)) ? { ...t, groupId, groupColor } : t,
  );
}

function ungroupTables(tables: TableData[], groupId: string): TableData[] {
  return tables.map((t) => {
    if (t.groupId !== groupId) return t;
    const { groupId: _g, groupColor: _c, ...rest } = t;
    return rest;
  });
}

/* ---------- 적용 ---------- */

export function applyTableAction(tables: TableData[], action: TableAction): TableData[] {
  switch (action.type) {
    case 'move':
    case 'merge': {
      const source = tables.find((t) => t.id === action.sourceId);
      const target = tables.find((t) => t.id === action.targetId);
      if (!source || !target) return tables;
      if (action.type === 'move' ? !canMoveTo(source, target) : !canMergeInto(source, target)) return tables;
      const nextTarget = action.type === 'move' ? moveSession(source, target) : mergeSession(source, target);
      return tables.map((t) => (t.id === source.id ? clearSession(source) : t.id === target.id ? nextTarget : t));
    }
    case 'group':
      return groupTables(tables, action.tableIds);
    case 'ungroup':
      return ungroupTables(tables, action.groupId);
  }
}

export function describeActionDone(action: TableAction, tables: TableData[]): string {
  const name = (id: string) => tables.find((t) => t.id === id)?.name ?? '';
  switch (action.type) {
    case 'move':
    case 'merge':
      return `${name(action.sourceId)} → ${name(action.targetId)} ${ACTION_LABEL[action.type]} 완료되었어요.`;
    case 'group':
      return `${action.tableIds.map(name).join(' · ')} 단체 지정되었어요.`;
    case 'ungroup':
      return '단체 그룹이 해제되었어요.';
  }
}
