import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { TooltipSettings } from '../choropleth';
import styles from './tooltip.module.scss';

type TTooltipProps = {
  left: number;
  top: number;
  setTooltip: Dispatch<SetStateAction<TooltipSettings | undefined>>;
  children: React.ReactNode;
};

export function Tooltip(props: TTooltipProps) {
  const { left, top, setTooltip, children } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && (left || top)) {
      const viewPort = { width: window.innerWidth, height: window.innerHeight };

      const boundingRect = ref.current.getBoundingClientRect();

      const rightPos = boundingRect.left + boundingRect.width;
      const bottomPos = boundingRect.top + boundingRect.height;

      const leftNudged =
        rightPos > viewPort.width ? left - (rightPos - viewPort.width) : left;

      const topNudged =
        bottomPos > viewPort.height ? top - (bottomPos - viewPort.height) : top;

      if (leftNudged !== left || topNudged !== top) {
        setTooltip(
          (tooltip) =>
            tooltip && { ...tooltip, left: leftNudged, top: topNudged }
        );
      }
    }
  }, [left, top, setTooltip]);

  return (
    <div ref={ref} className={styles.tooltipContainer} style={{ left, top }}>
      {children}
    </div>
  );
}
