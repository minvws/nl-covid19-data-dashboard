import css from '@styled-system/css';
import { ParentSize } from '@visx/responsive';
import { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  NationalInfectedAgeGroups,
  NationalInfectedAgeGroupsValue,
} from '~/types/data';
import { AgeGroupChart } from './age-group-chart';
import { AgeGroupTooltip } from './age-group-tooltip';

interface AgeGroupChartWrapperProps {
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

export function AgeGroupChartWrapper({ data }: AgeGroupChartWrapperProps) {
  const [tooltip, setTooltip] = useState<null | TooltipOptions>();

  // @TODO move this tooltip logic elsewhere
  // And combine with keyboard logic
  const timer = useRef(-1);

  const debounceSetTooltip = useCallback((options: TooltipOptions | null) => {
    if (timer.current > -1) {
      window.clearTimeout(timer.current);
      timer.current = -1;
    }

    timer.current = window.setTimeout(() => setTooltip(options), 100);
  }, []);

  const openTooltip = useCallback(
    (value: NationalInfectedAgeGroupsValue, x: number, y: number) => {
      const options: TooltipOptions = { left: x, top: y, value };
      debounceSetTooltip(options);
    },
    [debounceSetTooltip]
  );

  const closeTooltip = useCallback(() => {
    debounceSetTooltip(null);
  }, [debounceSetTooltip]);

  return (
    <Wrapper>
      <ParentSize>
        {(parent) => (
          <AgeGroupChart
            parentWidth={parent.width}
            data={data}
            openTooltip={openTooltip}
            closeTooltip={closeTooltip}
          />
        )}
      </ParentSize>
      {tooltip && (
        <AgeGroupTooltip
          left={tooltip.left}
          top={tooltip.top}
          value={tooltip.value}
        />
      )}
    </Wrapper>
  );
}
