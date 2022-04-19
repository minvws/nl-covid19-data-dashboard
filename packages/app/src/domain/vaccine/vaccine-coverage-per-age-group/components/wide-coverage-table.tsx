import {
  GmVaccineCoveragePerAgeGroupValue,
  NlVaccineCoveragePerAgeGroupValue,
  VrVaccineCoveragePerAgeGroupValue,
} from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { useVaccineCoveragePercentageFormatter } from '~/domain/vaccine/logic/use-vaccine-coverage-percentage-formatter';
import {
  COLOR_FIRST,
  COLOR_LAST,
  vaccinceMetrics,
} from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { WidePercentage } from '~/domain/vaccine/components/wide-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { SiteText } from '~/locale';
interface WideCoverageTable {
  text: SiteText['pages']['vaccinationsPage']['nl']['vaccination_coverage'];
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
  metrics: vaccinceMetrics;
}

export function WideCoverageTable({ values, text }: WideCoverageTable) {
  const { commonTexts, formatPercentage } = useIntl();
  const formatCoveragePercentage = useVaccineCoveragePercentageFormatter();

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
                  lg: '30%',
                }),
              })}
            >
              <InlineText variant="label1">{text.headers.agegroup}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '20%',
                }),
              })}
            >
              <InlineText variant="label1">
                {text.headers.labels.first}
              </InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                textAlign: 'right',
                pr: asResponsiveArray({ _: 3, xl: 4 }),
                width: asResponsiveArray({
                  _: '25%',
                  lg: '20%',
                }),
              })}
            >
              <InlineText variant="label1">
                {text.headers.labels.last}
              </InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                width: asResponsiveArray({
                  _: '20%',
                  lg: '30%',
                }),
              })}
            />
          </Row>
        </thead>
        <tbody>
          {values.map((item, index) => (
            <Row key={index}>
              <Cell>
                <AgeGroup
                  range={formatAgeGroupString(
                    item.age_group_range,
                    commonTexts.common.agegroup
                  )}
                  ageGroupTotal={
                    'age_group_total' in item ? item.age_group_total : undefined
                  }
                  birthyear_range={formatBirthyearRangeString(
                    item.birthyear_range,
                    commonTexts.common.birthyears
                  )}
                  text={commonTexts.common.agegroup.total_people}
                />
              </Cell>
              <Cell>
                <WidePercentage
                  value={
                    metrics.first.label in item
                      ? formatCoveragePercentage(item, metrics.first.percentage)
                      : `${formatPercentage(item[metrics.first.percentage])}%`
                  }
                  color={COLOR_FIRST}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <WidePercentage
                  value={
                    metrics.last.label in item
                      ? formatCoveragePercentage(item, metrics.last.percentage)
                      : `${formatPercentage(item[metrics.last.percentage])}%`
                  }
                  color={COLOR_LAST}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <Bar
                    value={item[metrics.first.percentage]}
                    color={COLOR_FIRST}
                    label={
                      metrics.first.label in item
                        ? item[metrics.first.label]
                        : undefined
                    }
                  />
                  <Bar
                    value={item[metrics.last.percentage]}
                    color={COLOR_LAST}
                    label={
                      metrics.last.label in item
                        ? item[metrics.last.label]
                        : undefined
                    }
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
