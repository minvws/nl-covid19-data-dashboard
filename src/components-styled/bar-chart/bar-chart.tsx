import { isDefined } from 'ts-is-present';
import { useElementSize } from '~/utils/use-element-size';
import { Box } from '../base';
import { Tooltip, useTooltip } from '../tooltip';
import { ValueAnnotation } from '../value-annotation';
import { BarChartChart } from './bar-chart-chart';
import { useBarChartCoordinates } from './bar-chart-coordinates';
import { BarChartTooltipContent } from './bar-chart-tooltip-contents';

interface BarChartProps {
  keys: string[];
  data: any[];
  axisTitle: string;
  valueAnnotation?: string;
}

export function NewBarChart({
  keys,
  data,
  axisTitle,
  valueAnnotation,
}: BarChartProps) {
  const [sizeRef, size] = useElementSize<HTMLDivElement>(400);

  const coordinates = useBarChartCoordinates(data, keys, size.width);

  const {
    openTooltip,
    closeTooltip,
    keyboardTooltip,
    tooltipState,
  } = useTooltip<any>({
    values: coordinates.values,
    getTooltipCoordinates: coordinates.getTooltipCoordinates,
  });

  return (
    <Box position="relative">
      {isDefined(valueAnnotation) && (
        <ValueAnnotation>{valueAnnotation}</ValueAnnotation>
      )}

      <div ref={sizeRef}>
        <BarChartChart
          coordinates={coordinates}
          openTooltip={openTooltip}
          closeTooltip={closeTooltip}
          keyboardTooltip={keyboardTooltip}
          xAxisLabel={axisTitle}
        />
      </div>

      <Tooltip controls="age-demographic-chart" tooltipState={tooltipState}>
        {tooltipState.value && (
          <BarChartTooltipContent value={tooltipState.value} />
        )}
      </Tooltip>
    </Box>
  );
}
