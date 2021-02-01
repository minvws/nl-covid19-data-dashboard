import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Box } from '~/components-styled/base';
import { TooltipSettings } from '../choropleth';

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
    <Box
      bg="white"
      position="absolute"
      ref={ref}
      style={{ left, top }}
      boxShadow="rgba(33, 33, 33, 0.2) 0px 1px 2px"
      borderRadius={1}
      zIndex={1000}
    >
      {children}
    </Box>
  );
}
