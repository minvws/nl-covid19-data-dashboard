import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Tooltip, useTooltip } from '~/components/tooltip';
import { AccessibilityOptions } from '~/utils/use-accessibility-options';
import {
  AgeDemographicChart,
  AGE_GROUP_TOOLTIP_WIDTH,
} from './age-demographic-chart';
import { useAgeDemographicCoordinates } from './age-demographic-coordinates';
import { AgeDemographicTooltipContent } from './age-demographic-tooltip-content';
import { AgeDemographicChartText, AgeDemographicDefaultValue } from './types';

export function AgeDemographic<T extends AgeDemographicDefaultValue>({
  data,
  metricProperty,
  displayMaxPercentage,
  text,
  accessibility,
}: {
  data: { values: T[] };
  metricProperty: keyof T;
  accessibility: AccessibilityOptions;
  displayMaxPercentage?: number;
  text: AgeDemographicChartText;
}) {
  const [ref, coordinates] = useAgeDemographicCoordinates(
    data,
    metricProperty,
    displayMaxPercentage
  );

  // Generate tooltip event handlers and state based on values and tooltip coordinates callback
  const { openTooltip, closeTooltip, keyboardNavigateTooltip, tooltipState } =
    useTooltip<T>({
      values: coordinates.values,
      getTooltipCoordinates: coordinates.getTooltipCoordinates,
    });

  return (
    <Box position="relative">
      <div ref={ref}>
        <ErrorBoundary>
          <AgeDemographicChart
            accessibility={accessibility}
            coordinates={coordinates}
            onMouseMoveBar={openTooltip}
            onMouseLeaveBar={closeTooltip}
            onKeyInput={keyboardNavigateTooltip}
            displayMaxPercentage={displayMaxPercentage}
            metricProperty={metricProperty}
            text={text}
          />
        </ErrorBoundary>
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
            text={text}
          />
        )}
      </Tooltip>
    </Box>
  );
}
