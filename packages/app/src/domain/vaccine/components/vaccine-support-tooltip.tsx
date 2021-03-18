import {
  formatPercentage,
  NlVaccineSupportValue,
} from '@corona-dashboard/common';
import styled from 'styled-components';
import { Spacer } from '~/components-styled/base';
import { SeriesConfig } from '~/components-styled/time-series-chart';
import { VisuallyHidden } from '~/components-styled/visually-hidden';
import { Locale } from '~/locale';
import { formatDateFromSeconds } from '~/utils/formatDate';

export function VaccineSupportTooltip({
  locale,
  value,
  config,
}: {
  locale: Locale;
  value: NlVaccineSupportValue;
  config: SeriesConfig<NlVaccineSupportValue>;
}) {
  const dateStartString = formatDateFromSeconds(value.date_start_unix, 'axis');
  const dateEndString = formatDateFromSeconds(value.date_end_unix, 'axis');

  const text = locale.vaccinaties;

  return (
    <section>
      <VisuallyHidden>{`${dateStartString} - ${dateEndString}`}</VisuallyHidden>
      <TooltipList>
        {[...config].reverse().map((x) => {
          if (x.type === 'range') {
            return (
              <TooltipListItem key={x.metricPropertyLow} color={x.color}>
                <TooltipValueContainer>
                  {x.label}:{' '}
                  <b>
                    {`${value[x.metricPropertyLow]} - ${
                      value[x.metricPropertyHigh]
                    }`}
                    %
                  </b>
                </TooltipValueContainer>
              </TooltipListItem>
            );
          } else {
            return (
              <TooltipListItem key={x.metricProperty} color={x.color}>
                <TooltipValueContainer>
                  {x.label}: <b>{formatPercentage(value[x.metricProperty])}%</b>
                </TooltipValueContainer>
              </TooltipListItem>
            );
          }
        })}

        <Spacer mb={1} />
        <TooltipListItem color="transparent">
          <TooltipValueContainer>
            {`${text.grafiek_draagvlak.tooltip_gemiddeld}:`}
            <b>{formatPercentage(value['percentage_average'])}%</b>
          </TooltipValueContainer>
        </TooltipListItem>
      </TooltipList>
    </section>
  );
}

const TooltipList = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

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

const TooltipValueContainer = styled.span`
  display: flex;
  width: 100%;
  min-width: 130px;
  justify-content: space-between;
`;
