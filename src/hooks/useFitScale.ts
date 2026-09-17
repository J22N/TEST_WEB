import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * 컨테이너 폭에 맞춰 디자인 기준 폭(designWidth)을 축소할 배율 반환 (최대 1).
 * 컨테이너가 디자인 폭보다 넓으면 1, 좁으면 비율대로 줄어든다.
 */
export function useFitScale(ref: RefObject<HTMLElement | null>, designWidth: number): number {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = (width: number) => {
      setScale(Math.min(1, width / designWidth));
    };

    update(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, designWidth]);

  return scale;
}
