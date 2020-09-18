import { useEffect, useRef } from 'react';
import styles from './tooltip.module.scss';

export default function Tooltip(props: any) {
  const { tooltipStore, getTooltipContent } = props;
  const ref = useRef<HTMLDivElement | undefined>();
  const [tooltip, updateTooltip] = tooltipStore((state: any) => [
    state.tooltip,
    state.updateTooltip,
  ]);

  useEffect(() => {
    if (ref.current) {
      const viewPort = { width: window.innerWidth, height: window.innerHeight };

      const boundingRect = ref.current.getBoundingClientRect();

      const rightPos = boundingRect.left + boundingRect.width;
      const bottomPos = boundingRect.top + boundingRect.height;

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
