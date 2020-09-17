import { useEffect, useRef } from 'react';
import styles from './tooltip.module.scss';

function getOffsetInViewPort(el: HTMLElement) {
  const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return [{ top: rect.top + scrollTop, left: rect.left + scrollLeft }, rect];
}

export default function Tooltip(props: any) {
  const { tooltipStore, getTooltipContent } = props;
  const ref = useRef<HTMLDivElement | undefined>();
  const [tooltip, updateTooltip] = tooltipStore((state: any) => [
    state.tooltip,
    state.updateTooltip,
  ]);

  useEffect(() => {
    if (ref.current) {
      const { parentElement } = ref.current;

      if (!parentElement) {
        return;
      }

      const viewPort = { width: window.innerWidth, height: window.innerHeight };

      const [offset, rect] = getOffsetInViewPort(ref.current);

      const rightPos = offset.left + ref.current.clientWidth;
      const bottomPos = rect.top + ref.current.clientHeight;

      const left =
        rightPos > viewPort.width
          ? tooltip.left - (rightPos - viewPort.width)
          : tooltip.left;

      const top =
        bottomPos > viewPort.height
          ? tooltip.top - (bottomPos - viewPort.height)
          : tooltip.top;

      if (left !== tooltip.left || top !== tooltip.top) {
        updateTooltip({ ...tooltip, left, top });
      }
    }
  }, [tooltip, updateTooltip]);

  return tooltip ? (
    <div
      ref={ref as any}
      className={styles.tooltip}
      style={{
        left: tooltip.left,
        top: tooltip.top,
      }}
    >
      {getTooltipContent(tooltip.data)}
    </div>
  ) : null;
}
