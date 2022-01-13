import { NlBoosterShotPerAgeGroupValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '../../logic/use-vaccine-coverage-percentage-formatter';
import { COLOR_FULLY_BOOSTERED } from '../common';
import { AgeGroup } from './age-group';
import { Bar } from './bar';
import { WidePercentage } from './wide-percentage';
interface WideCoverageTable {
  values: NlBoosterShotPerAgeGroupValue[];
}

export function WideCoverageTable({ values }: WideCoverageTable) {
  const { siteText, formatPercentage } = useIntl();
  const text = siteText.vaccinaties.vaccination_coverage;
  const { templates } = siteText.vaccinaties.vaccination_coverage;

  return (
    <Box overflow="auto">
      <StyledTable>
        <thead
          css={css({
            borderBottom: '1px solid',
            borderColor: 'silver',
          })}
        >
          <Row>
            <HeaderCell
              css={css({
                textAlign: 'left',
                width: asResponsiveArray({
                  _: '30%',
                  lg: '33%',
                }),
              })}
            >
              <InlineText variant="label1">{text.headers.agegroup}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'left',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '33%',
                }),
              })}
            >
              <InlineText variant="label1">
                {text.headers.first_shot}
              </InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '34%',
                }),
              })}
            >
              <InlineText variant="label1">{text.headers.coverage}</InlineText>
            </HeaderCell>
          </Row>
        </thead>
        <tbody>
          {values.map((item, index) => (
            <Row key={index}>
              <Cell>
                <AgeGroup
                  range={formatAgeGroupString(
                    item.age_group_range,
                    templates.agegroup
                  )}
                  ageGroupTotal={
                    'age_group_total' in item ? item.age_group_total : undefined
                  }
                  birthyear_range={formatBirthyearRangeString(
                    item.birthyear_range,
                    templates.birthyears
                  )}
                />
              </Cell>
              <Cell>
                <WidePercentage
                  value={`${item.received_booster_total} (${formatPercentage(
                    item.received_booster_percentage
                  )}%)`}
                  color={COLOR_FULLY_BOOSTERED}
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <Bar
                    value={item.received_booster_percentage}
                    color={COLOR_FULLY_BOOSTERED}
                  />
                </Box>
              </Cell>
            </Row>
          ))}
        </tbody>
      </StyledTable>
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
