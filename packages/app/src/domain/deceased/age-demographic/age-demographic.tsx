import { Box } from '~/components-styled/base';
import { Tooltip, useTooltip } from '~/components-styled/tooltip';
import {
  AgeDemographicChart,
  AGE_GROUP_TOOLTIP_WIDTH,
} from './age-demographic-chart';
import {
  AgeDemographicDefaultValue,
  useAgeDemographicCoordinates,
} from './age-demographic-coordinates';
import { AgeDemographicTooltipContent } from './age-demographic-tooltip-content';

export function AgeDemographic<T extends AgeDemographicDefaultValue>({
  data,
  metricProperty,
}: {
  data: { values: T[] };
  metricProperty: keyof T;
}) {
  const [ref, coordinates] = useAgeDemographicCoordinates(data, metricProperty);

  // Generate tooltip event handlers and state based on values and tooltip coordinates callback
  const {
    openTooltip,
    closeTooltip,
    keyboardNavigateTooltip,
    tooltipState,
  } = useTooltip<T>({
    values: coordinates.values,
    getTooltipCoordinates: coordinates.getTooltipCoordinates,
  });

  return (
    <Box position="relative">
      <div ref={ref}>
        <AgeDemographicChart
          coordinates={coordinates}
          onMouseMoveBar={openTooltip}
          onMouseLeaveBar={closeTooltip}
          onKeyInput={keyboardNavigateTooltip}
        />
      </div>

      <Tooltip
        controls="age-demographic-chart"
        tooltipState={tooltipState}
        width={AGE_GROUP_TOOLTIP_WIDTH}
      >
        {tooltipState.value && (
          <AgeDemographicTooltipContent
            value={tooltipState.value}
            metricProperty={metricProperty}
          />
        )}
      </Tooltip>
    </Box>
  );
}
