import css from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data';
import { AgeDemographicChart } from './age-demographic-chart';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { getAgeDemographicCoordinates } from './age-demographic-coordinates';
// import { AgeDemographicTooltipContent } from './age-demographic-tooltip';
// import { Tooltip } from './tooltip';

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
  // const [tooltip, setTooltip] = useState<TooltipOptions>();
  const [parentWidth, setParentWidth] = useState(0);

  const breakpoints = useBreakpoints();
  const isSmallScreen = !breakpoints.md;

  const coordinates = getAgeDemographicCoordinates(
    data,
    isSmallScreen,
    parentWidth
  );

  // const [tooltipKeyboardIndex, setTooltipKeyboardIndex] = useState<number>();

  // const keyboardTooltip = (
  //   event: any,
  //   getTooltipCoordinates: (
  //     event: MouseEvent<SVGGElement> | undefined,
  //     value: NationalInfectedAgeGroupsValue
  //   ) => { x: number; y: number }
  // ) => {
  //   const KEY_ARROW_LEFT = 37;
  //   const KEY_ARROW_RIGHT = 39;

  //   if (event.which !== KEY_ARROW_LEFT && event.which !== KEY_ARROW_RIGHT) {
  //     return;
  //   }

  //   const direction = event.which === KEY_ARROW_LEFT ? -1 : 1;
  //   setTooltipKeyboardIndex(
  //     ((tooltipKeyboardIndex ?? -1) + direction + data.values.length) %
  //     data.values.length
  //   );

  //   const value =
  //     tooltipKeyboardIndex !== undefined
  //       ? data.values[tooltipKeyboardIndex]
  //       : undefined;

  //   if (!value) {
  //     return;
  //   }

  //   const { x, y } = getTooltipCoordinates(undefined, value);
  //   const options: TooltipOptions = { left: x, top: y, value };
  //   setTooltip(options);
  // };

  return (
    <Box mx={-4}>
      <Wrapper>
        <ParentSize>
          {(parent) => {
            setParentWidth(parent.width);
            return <AgeDemographicChart coordinates={coordinates} />;
          }}
        </ParentSize>
        {/* {
          tooltip && (
            <Tooltip>
              <AgeDemographicTooltipContent
                value={tooltip.value}
              />
            </Tooltip>
          )
        } */}
      </Wrapper>
    </Box>
  );
}
