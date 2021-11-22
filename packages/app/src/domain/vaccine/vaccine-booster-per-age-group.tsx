import {
  assert,
  colors,
  NlBoosterShotPerAgeGroupValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import { maxBy } from 'lodash';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { ChartTile } from '~/components/chart-tile';
import { PercentageBar } from '~/components/percentage-bar';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';

interface VaccineBoosterPerAgeGroupProps {
  data: NlBoosterShotPerAgeGroupValue[];
  sortingOrder: string[];
}

export function VaccineBoosterPerAgeGroup({
  data,
  sortingOrder,
}: VaccineBoosterPerAgeGroupProps) {
  const { siteText, formatNumber } = useIntl();

  const text = siteText.vaccinaties.booster_per_age_group_section;

  const getSortingOrder = (ageGroup: string) => {
    const index = sortingOrder.findIndex((x) => x === ageGroup);

    assert(index >= 0, `No sorting order defined for age group ${ageGroup}`);

    return index;
  };

  const sortedValues = data.sort(
    (a, b) =>
      getSortingOrder(a.age_group_range) - getSortingOrder(b.age_group_range)
  );

  const highestValue = maxBy(sortedValues, (x) => x.received_booster_total);

  return (
    <ChartTile
      title={text.title}
      description={text.description}
      metadata={{
        source: text.sources,
        date: [data[0].date_start_unix, data[0].date_end_unix],
      }}
    >
      <Box overflow="auto">
        <StyledTable>
          <thead
            css={css({
              borderBottom: '1px solid',
              borderColor: 'silver',
            })}
          >
            <Row>
              <HeaderCell>{text.labels.age_group}</HeaderCell>

              <HeaderCell>{text.labels.amount_of_booster_shots}</HeaderCell>
            </Row>
          </thead>
          <tbody>
            {sortedValues.map((item, index) => (
              <Row key={index}>
                <Cell>
                  <AgeGroup
                    range={formatAgeGroupString(
                      item.age_group_range,
                      text.templates.agegroup
                    )}
                    birthyear_range={formatBirthyearRangeString(
                      item.birthyear_range,
                      text.templates.birthyears
                    )}
                  />
                </Cell>
                <Cell
                  css={css({
                    display: 'flex',
                    alignItems: 'center',
                    maxWidth: '15rem',
                  })}
                >
                  <InlineText
                    variant="h3"
                    color="data.darkBlue"
                    textAlign="right"
                    css={css({
                      // To make sure all the numbers are right aligned with the highest number in the data
                      minWidth: `${
                        `${highestValue?.received_booster_total}`.length + 1
                      }ch`,
                      pr: 2,
                    })}
                  >
                    {formatNumber(item.received_booster_total)}
                  </InlineText>
                  <PercentageBar
                    percentage={item.received_booster_percentage}
                    color={colors.data.darkBlue}
                  />
                </Cell>
              </Row>
            ))}
          </tbody>
        </StyledTable>
      </Box>
    </ChartTile>
  );
}

interface AgeGroupProps {
  range: string;
  birthyear_range: string;
}

export function AgeGroup({ range, birthyear_range }: AgeGroupProps) {
  return (
    <Box display="flex" flexDirection="column">
      <InlineText fontWeight="bold">{range}</InlineText>
      <InlineText variant="label1">{`${birthyear_range}`}</InlineText>
    </Box>
  );
}

const StyledTable = styled.table(
  css({
    borderCollapse: 'collapse',
    width: '100%',
  })
);

const Row = styled.tr(
  css({
    borderBottom: '1px solid',
    borderColor: 'silver',

    '&:last-of-type': {
      borderBottom: '0px solid',
    },
  })
);

const HeaderCell = styled.th(
  css({
    textAlign: 'left',
    fontWeight: 'bold',
    verticalAlign: 'middle',
    pb: 2,
  })
);

const Cell = styled.td(
  css({
    py: 3,
    verticalAlign: 'middle',
  })
);
