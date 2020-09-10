import { useTooltip } from '@vx/tooltip';
import { localPoint } from '@vx/event';

export type TShowTooltipFunc = (event: any, datum: any) => void;
export type TTooltipInfo<T> = {
  tooltipData: T | undefined;
  tooltipLeft?: number;
  tooltipTop?: number;
  tooltipOpen: boolean;
};

export default function useMapTooltip<T>(): [
  TShowTooltipFunc,
  () => void,
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

  const handleMouseOver = (event: any, datum: T) => {
    const coords = localPoint(event.target.ownerSVGElement, event);
    showTooltip({
      tooltipLeft: (coords?.x ?? 0) + 5,
      tooltipTop: (coords?.y ?? 0) + 5,
      tooltipData: datum,
    });
  };

  return [
    handleMouseOver,
    hideTooltip,
    {
      tooltipData,
      tooltipLeft,
      tooltipTop,
      tooltipOpen,
    },
  ];
}
