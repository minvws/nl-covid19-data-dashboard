import { ParentSize } from '@visx/responsive';
import { useState } from 'react';
import { Box } from '~/components-styled/base';
import { Tooltip, useTooltip } from '~/components-styled/tooltip';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data';
import { useBreakpoints } from '~/utils/useBreakpoints';
import {
  AgeDemographicChart,
  AGE_GROUP_TOOLTIP_WIDTH,
} from './age-demographic-chart';
import { useAgeDemographicCoordinates } from './age-demographic-coordinates';
import { AgeDemographicTooltipContent } from './age-demographic-tooltip-content';

interface AgeDemographicProps {
  data: NationalInfectedAgeGroups;
}

export function AgeDemographic({ data }: AgeDemographicProps) {
  const [parentWidth, setParentWidth] = useState(0);
  const breakpoints = useBreakpoints();
  const isSmallScreen = !breakpoints.xl;

  // Calculate graph's coordinates based on the data, the component width and wheher we are on a small screen or not.
  const coordinates = useAgeDemographicCoordinates(
    data,
    isSmallScreen,
    parentWidth
  );

  // Generate tooltip event handlers and state based on values and tooltip coordinates callback
  const {
    openTooltip,
    closeTooltip,
    keyboardTooltip,
    tooltipState,
  } = useTooltip<NationalInfectedAgeGroupsValue>({
    values: coordinates.values,
    getTooltipCoordinates: coordinates.getTooltipCoordinates,
  });

  return (
    <Box mx={-4}>
      <Box position="relative">
        <ParentSize>
          {(parent) => {
            setParentWidth(parent.width);
            return (
              <AgeDemographicChart
                coordinates={coordinates}
                openTooltip={openTooltip}
                closeTooltip={closeTooltip}
                keyboardTooltip={keyboardTooltip}
              />
            );
          }}
        </ParentSize>
        <Tooltip
          controls="age-demographic-chart"
          tooltipState={tooltipState}
          width={AGE_GROUP_TOOLTIP_WIDTH}
        >
          <AgeDemographicTooltipContent value={tooltipState.value} />
        </Tooltip>
      </Box>
    </Box>
  );
}
