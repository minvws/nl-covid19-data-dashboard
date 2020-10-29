import { ReactNode, useEffect, useRef } from 'react';
import { UseStore } from 'zustand';
import classNames from 'classnames';
import { TooltipState } from '../Choropleth';
import styles from './tooltip.module.scss';

export type TTooltipProps = {
  disablePointerEvents?: boolean;
  tooltipStore: UseStore<TooltipState>;
  getTooltipContent: (id: string) => ReactNode;
};

export function Tooltip(props: TTooltipProps) {
  const { tooltipStore, getTooltipContent, disablePointerEvents } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [tooltip, updateTooltip] = tooltipStore((state: TooltipState) => [
    state.tooltip,
    state.update,
  ]);

  useEffect(() => {
    if (ref.current && tooltip) {
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
      ref={ref}
      className={classNames(
        styles.tooltipContainer,
        disablePointerEvents && styles['is-nonInteractive']
      )}
      style={{
        left: tooltip.left,
        top: tooltip.top,
      }}
    >
      {getTooltipContent(tooltip.data)}
    </div>
  ) : null;
}
