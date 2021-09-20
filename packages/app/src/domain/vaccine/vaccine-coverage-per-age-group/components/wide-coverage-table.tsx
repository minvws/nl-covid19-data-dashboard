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
import { COLOR_FULLY_VACCINATED, COLOR_HAS_ONE_SHOT } from '../common';
import { formatAgeGroupString } from '../logic/format-age-group-string';
import { formatBirthyearRangeString } from '../logic/format-birthyear-range-string';
import { AgeGroup } from './age-group';
import { Bar } from './bar';
import { WidePercentage } from './wide-percentage';
interface WideCoverageTable {
  values:
    | NlVaccineCoveragePerAgeGroupValue[]
    | VrVaccineCoveragePerAgeGroupValue[]
    | GmVaccineCoveragePerAgeGroupValue[];
}

export function WideCoverageTable({ values }: WideCoverageTable) {
  const { siteText } = useIntl();
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
                {text.headers.first_shot}
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
              <InlineText variant="label1">{text.headers.coverage}</InlineText>
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
                  value={item.has_one_shot_percentage}
                  color={COLOR_HAS_ONE_SHOT}
                  label={
                    'has_one_shot_percentage_label' in item
                      ? item.has_one_shot_percentage_label
                      : undefined
                  }
                />
              </Cell>
              <Cell>
                <WidePercentage
                  value={item.fully_vaccinated_percentage}
                  color={COLOR_FULLY_VACCINATED}
                  label={
                    'fully_vaccinated_percentage_label' in item
                      ? item.fully_vaccinated_percentage_label
                      : undefined
                  }
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <Bar
                    value={item.has_one_shot_percentage}
                    color={COLOR_HAS_ONE_SHOT}
                    label={
                      'has_one_shot_percentage_label' in item
                        ? item.has_one_shot_percentage_label
                        : undefined
                    }
                  />
                  <Bar
                    value={item.fully_vaccinated_percentage}
                    color={COLOR_FULLY_VACCINATED}
                    label={
                      'fully_vaccinated_percentage_label' in item
                        ? item.fully_vaccinated_percentage_label
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
