import css from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { MouseEvent, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data';
import { AgeDemographicChart } from './age-demographic-chart';
import { AgeDemographicTooltip } from './age-demographic-tooltip';

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

  // @TODO move this tooltip logic elsewhere
  // And combine with keyboard logic
  const timer = useRef(-1);

  const debounceSetTooltip = useCallback(
    (options: TooltipOptions | undefined) => {
      if (timer.current > -1) {
        window.clearTimeout(timer.current);
      }

      timer.current = window.setTimeout(() => setTooltip(options), 100);
    },
    []
  );

  const openTooltip = useCallback(
    (
      event: MouseEvent<SVGGElement>,
      value: NationalInfectedAgeGroupsValue,
      getTooltipCoordinates: (
        event: MouseEvent<SVGGElement>,
        value: NationalInfectedAgeGroupsValue
      ) => { x: number; y: number }
    ) => {
      const { x, y } = getTooltipCoordinates(event, value);
      const options: TooltipOptions = { left: x, top: y, value };
      debounceSetTooltip(options);
    },
    [debounceSetTooltip]
  );

  const closeTooltip = useCallback(() => {
    debounceSetTooltip(undefined);
  }, [debounceSetTooltip]);

  return (
    <Box mx={-4}>
      <Wrapper>
        <ParentSize>
          {(parent) => (
            <AgeDemographicChart
              parentWidth={parent.width}
              data={data}
              openTooltip={openTooltip}
              closeTooltip={closeTooltip}
            />
          )}
        </ParentSize>
        {tooltip && (
          <AgeDemographicTooltip
            left={tooltip.left}
            top={tooltip.top}
            value={tooltip.value}
          />
        )}
      </Wrapper>
    </Box>
  );
}
