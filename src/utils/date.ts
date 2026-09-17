const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** 8.29. (금) */
export function formatShortDate(date: Date): string {
  return `${date.getMonth() + 1}.${date.getDate()}. (${WEEKDAYS[date.getDay()]})`;
}

/** 오후 3:19 */
export function formatKoTime(date: Date): string {
  const hours = date.getHours();
  const period = hours < 12 ? '오전' : '오후';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${period} ${hour12}:${minutes}`;
}
