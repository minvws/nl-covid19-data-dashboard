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
        event: MouseEvent<SVGGElement> | undefined,
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

  const [tooltipKeyboardIndex, setTooltipKeyboardIndex] = useState<number>();

  const keyboardTooltip = (
    event: any,
    getTooltipCoordinates: (
      event: MouseEvent<SVGGElement> | undefined,
      value: NationalInfectedAgeGroupsValue
    ) => { x: number; y: number }
  ) => {
    const KEY_ARROW_LEFT = 37;
    const KEY_ARROW_RIGHT = 39;

    if (event.which !== KEY_ARROW_LEFT && event.which !== KEY_ARROW_RIGHT) {
      return;
    }

    const direction = event.which === KEY_ARROW_LEFT ? -1 : 1;
    setTooltipKeyboardIndex(
      ((tooltipKeyboardIndex ?? -1) + direction + data.values.length) %
        data.values.length
    );

    const value =
      tooltipKeyboardIndex !== undefined
        ? data.values[tooltipKeyboardIndex]
        : undefined;

    if (!value) {
      return;
    }

    const { x, y } = getTooltipCoordinates(undefined, value);
    const options: TooltipOptions = { left: x, top: y, value };
    setTooltip(options);
  };

  return (
    <Box mx={-4}>
      <Wrapper>
        <ParentSize>
          {(parent) => (
            <AgeDemographicChart
              parentWidth={parent.width}
              data={data}
              keyboardTooltip={keyboardTooltip}
              openTooltip={openTooltip}
              closeTooltip={closeTooltip}
            />
          )}
        </ParentSize>
        <AgeDemographicTooltip
          left={tooltip?.left}
          top={tooltip?.top}
          value={tooltip?.value}
        />
      </Wrapper>
    </Box>
  );
}
