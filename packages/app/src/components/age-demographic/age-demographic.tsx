import { Box } from '~/components/base';
import { ErrorBoundary } from '~/components/error-boundary';
import { Tooltip, useTooltip } from '~/components/tooltip';
import {
  AccessibilityDefinition,
  addAccessibilityFeatures,
} from '~/utils/use-accessibility-annotations';
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
  /**
   * The mandatory AccessibilityDefinition provides a reference to annotate the
   * graph with a label and description.
   */
  accessibility: AccessibilityDefinition;
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

  const ageDemographicAccessibility = addAccessibilityFeatures(accessibility, [
    'keyboard_time_series_chart',
  ]);

  return (
    <Box position="relative">
      <ErrorBoundary>
        <div ref={ref}>
          <AgeDemographicChart
            accessibility={ageDemographicAccessibility}
            coordinates={coordinates}
            onMouseMoveBar={openTooltip}
            onMouseLeaveBar={closeTooltip}
            onKeyInput={keyboardNavigateTooltip}
            displayMaxPercentage={displayMaxPercentage}
            metricProperty={metricProperty}
            text={text}
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
              text={text}
            />
          )}
        </Tooltip>
      </ErrorBoundary>
    </Box>
  );
}
