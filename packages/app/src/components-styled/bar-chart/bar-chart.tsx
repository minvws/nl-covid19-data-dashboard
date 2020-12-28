import { isDefined } from 'ts-is-present';
import { useElementSize } from '~/utils/use-element-size';
import { Box } from '../base';
import { Tooltip, useTooltip } from '../tooltip';
import { ValueAnnotation } from '../value-annotation';
import { BarChartGraph } from './bar-chart-graph';
import { BarChartValue, useBarChartCoordinates } from './bar-chart-coordinates';
import { BarChartTooltipContent } from './bar-chart-tooltip-contents';

interface BarChartProps {
  values: BarChartValue[];
  xAxisTitle: string;
  accessibilityDescription: string;
  valueAnnotation?: string;
}

export function BarChart({
  values,
  xAxisTitle,
  accessibilityDescription,
  valueAnnotation,
}: BarChartProps) {
  const [sizeRef, size] = useElementSize<HTMLDivElement>(400);

  const coordinates = useBarChartCoordinates(values, size.width);

  const {
    openTooltip,
    closeTooltip,
    keyboardNavigateTooltip,
    tooltipState,
  } = useTooltip<BarChartValue>({
    values: coordinates.values,
    getTooltipCoordinates: coordinates.getTooltipCoordinates,
  });

  return (
    <Box position="relative">
      {isDefined(valueAnnotation) && (
        <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
      )}

      <div ref={sizeRef}>
        <BarChartGraph
          coordinates={coordinates}
          onMouseMoveBar={openTooltip}
          onMouseLeaveBar={closeTooltip}
          onKeyInput={keyboardNavigateTooltip}
          xAxisLabel={xAxisTitle}
          accessibilityDescription={accessibilityDescription}
        />
      </div>
      <Tooltip tooltipState={tooltipState} tooltipArrow={'left'}>
        {tooltipState.value && (
          <BarChartTooltipContent value={tooltipState.value} />
        )}
      </Tooltip>
    </Box>
  );
}
