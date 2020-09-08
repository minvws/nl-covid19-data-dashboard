import { useTooltip, useTooltipInPortal } from '@vx/tooltip';
import { localPoint } from '@vx/event';

import { ResizeObserver } from '@juggle/resize-observer';

export type TShowTooltipFunc = (event: any, datum: any) => void;
export type TTooltipInfo<T> = {
  tooltipData: T;
  tooltipLeft?: number;
  tooltipTop?: number;
  tooltipOpen: boolean;
};

export default function useMapTooltip<T>(): [
  TShowTooltipFunc,
  () => void,
  (element: HTMLElement | SVGElement | null) => void,
  React.FC<any>,
  TTooltipInfo<T> | undefined
] {
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<T>();

  // If you don't want to use a Portal, simply replace `TooltipInPortal` below with
  // `Tooltip` or `TooltipWithBounds` and remove `containerRef`
  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    // use TooltipWithBounds
    detectBounds: true,
    // when tooltip containers are scrolled, this will correctly update the Tooltip position
    scroll: true,
    polyfill: ResizeObserver,
  });

  const handleMouseOver = (event: any, datum: T) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: coords?.x ?? 0,
      tooltipTop: coords?.y ?? 0,
      tooltipData: datum,
    });
  };

  return [
    handleMouseOver,
    hideTooltip,
    containerRef,
    TooltipInPortal,
    {
      tooltipData,
      tooltipLeft,
      tooltipTop,
      tooltipOpen,
    } as any,
  ];
}
