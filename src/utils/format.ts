export function formatPrice(value: number): string {
  return `${value.toLocaleString('ko-KR')}원`;
}

export function formatMinutes(minutes: number): string {
  return `${String(minutes).padStart(3, '0')}분`;
}
