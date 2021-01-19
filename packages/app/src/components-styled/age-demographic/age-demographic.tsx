import { Box } from '~/components-styled/base';
import { Tooltip, useTooltip } from '~/components-styled/tooltip';
import {
  AgeDemographicChart,
  AGE_GROUP_TOOLTIP_WIDTH,
} from './age-demographic-chart';
import { useAgeDemographicCoordinates } from './age-demographic-coordinates';
import { AgeDemographicTooltipContent } from './age-demographic-tooltip-content';
import { AgeDemographicDefaultValue } from './types';

export function AgeDemographic<T extends AgeDemographicDefaultValue>({
  data,
  metricProperty,
  visuallyMaxPercentage,
}: {
  data: { values: T[] };
  metricProperty: keyof T;
  visuallyMaxPercentage?: number;
}) {
  const [ref, coordinates] = useAgeDemographicCoordinates(
    data,
    metricProperty,
    visuallyMaxPercentage
  );

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
          visuallyMaxPercentage={visuallyMaxPercentage}
          metricProperty={metricProperty}
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
