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
  COLOR_FULLY_VACCINATED,
  COLOR_FULLY_BOOSTERED,
  COLOR_AUTUMN_2022_SHOT,
} from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { WidePercentage } from '~/domain/vaccine/components/wide-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { SiteText } from '~/locale';
interface WideCoverageTable {
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
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
              <InlineText variant="label1">{'Najaarsprik'}</InlineText>
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
              <InlineText variant="label1">{'Basisserie'}</InlineText>
            </HeaderCell>
            <HeaderCell
              css={css({
                width: asResponsiveArray({
                  _: '20%',
                  lg: '30%',
                }),
              })}
            >
              <InlineText variant="label1">
                {'Verschil opkomst basisserie en najaarsprik'}
              </InlineText>
            </HeaderCell>
          </Row>
        </thead>
        <tbody>
          {values.map((item, index) => (
            <Row key={index}>
              <HeaderCell isColumn>
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
              </HeaderCell>
              <Cell>
                <WidePercentage
                  value={
                    'fully_vaccinated_percentage_label' in item
                      ? formatCoveragePercentage(
                          item,
                          'fully_vaccinated_percentage'
                        )
                      : `${formatPercentage(item.fully_vaccinated_percentage)}%`
                  }
                  color={COLOR_AUTUMN_2022_SHOT}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <WidePercentage
                  value={
                    'booster_shot_percentage_label' in item
                      ? formatCoveragePercentage(
                          item,
                          'booster_shot_percentage'
                        )
                      : item.booster_shot_percentage === null
                      ? text.no_data
                      : `${formatPercentage(item.booster_shot_percentage)}%`
                  }
                  color={COLOR_FULLY_BOOSTERED}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <Bar
                    value={item.fully_vaccinated_percentage}
                    color={COLOR_FULLY_VACCINATED}
                    label={
                      'fully_vaccinated_percentage_label' in item
                        ? item.fully_vaccinated_percentage_label
                        : undefined
                    }
                  />
                  <Bar
                    value={item.booster_shot_percentage}
                    color={COLOR_FULLY_BOOSTERED}
                    label={
                      'booster_shot_percentage_label' in item
                        ? item.booster_shot_percentage_label
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

const HeaderCell = styled.th<{ isColumn?: boolean }>((x) =>
  css({
    textAlign: 'left',
    fontWeight: x.isColumn ? 'normal' : 'bold',
    verticalAlign: 'middle',
    pb: x.isColumn ? undefined : 2,
    py: x.isColumn ? 3 : undefined,
  })
);

const Cell = styled.td(
  css({
    py: 3,
    verticalAlign: 'middle',
  })
);
