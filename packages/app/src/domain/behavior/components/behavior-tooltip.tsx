import {
  formatPercentage,
  NationalBehaviorValue,
  RegionalBehaviorValue,
} from '@corona-dashboard/common';
import styled from 'styled-components';
import { SeriesConfig } from '~/components-styled/time-series-chart';
import { InlineText } from '~/components-styled/typography';

export function BehaviorTooltip({
  value,
  valueKey,
  config,
}:
  | {
      value: RegionalBehaviorValue;
      valueKey: keyof RegionalBehaviorValue;
      config: SeriesConfig<RegionalBehaviorValue>;
    }
  | {
      value: NationalBehaviorValue;
      valueKey: keyof NationalBehaviorValue;
      config: SeriesConfig<NationalBehaviorValue>;
    }) {
  const cf = (config as any[]).find((x) => x.metricProperty === valueKey);

  return (
    cf && (
      <section>
        <TooltipListItem color={cf.color}>
          <InlineText>
            {cf.label}: <b>{formatPercentage((value as any)[valueKey])}%</b>
          </InlineText>
        </TooltipListItem>
      </section>
    )
  );
}

interface TooltipListItemProps {
  color: string;
}

const TooltipListItem = styled.li<TooltipListItemProps>`
  display: flex;
  align-items: center;

  &::before {
    content: '';
    display: inline-block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background: ${(props) => props.color};
    margin-right: 0.5em;
    flex-shrink: 0;
  }
`;
