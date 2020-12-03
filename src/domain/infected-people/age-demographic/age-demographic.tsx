import css from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { MouseEvent, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { AgeDemographicChart } from './age-demographic-chart';
import { getAgeDemographicCoordinates } from './age-demographic-coordinates';
import { AgeDemographicTooltipContent } from './age-demographic-tooltip';
import { Tooltip } from './tooltip';

interface AgeDemographicProps {
  data: NationalInfectedAgeGroups;
}

interface TooltipOptions {
  left: number;
  top: number;
  value: NationalInfectedAgeGroupsValue;
}

const Wrapper = styled.div(
  css({
    position: 'relative',
  })
);

export function AgeDemographic({ data }: AgeDemographicProps) {
  const [tooltip, setTooltip] = useState<TooltipOptions>();
  const [parentWidth, setParentWidth] = useState(0);

  const breakpoints = useBreakpoints();
  const isSmallScreen = !breakpoints.md;

  const coordinates = getAgeDemographicCoordinates(data, isSmallScreen, parentWidth);



  return (
    <Box mx={-4}>
      <Wrapper>
        <ParentSize>
          {(parent) => {
            setParentWidth(parent.width);
            return (
              <AgeDemographicChart
                coordinates={coordinates}
                openTooltip={openTooltip}
                closeTooltip={closeTooltip}
              />
            )
          }}
        </ParentSize>
        {tooltip && (
          <Tooltip>
            <AgeDemographicTooltipContent
              value={tooltip.value}
            />
          </Tooltip>
        )}
      </Wrapper>
    </Box>
  );
}
