import styled from 'styled-components';
import css from '@styled-system/css';
import { Box } from '~/components/base';
import { asResponsiveArray } from '~/style/utils';
import { useIntl } from '~/intl';
import { InlineText } from '~/components/typography';
import { AgeGroup } from './age-group';
import { formatAgeGroupString } from '../logic/format-age-group-string';
import { formatBirthyearRangeString } from '../logic/format-birthyear-range-string';
import { replaceVariablesInText } from '~/utils/replace-variables-in-text';
import { PercentageBar } from '~/components/percentage-bar';
import { COLOR_HAS_ONE_SHOT, COLOR_FULLY_VACCINATED } from '../common';
import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';

interface WideCoverageTable {
  values: NlVaccineCoveragePerAgeGroupValue[];
}

export function WideCoverageTable({ values }: WideCoverageTable) {
  const { siteText, formatNumber } = useIntl();
  const { headers } = siteText.vaccinaties.vaccination_coverage;
  const { templates, age_group_tooltips } =
    siteText.vaccinaties.vaccination_coverage;

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
              {headers.agegroup}
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
              {headers.first_shot}
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
              <InlineText> {headers.coverage}</InlineText>
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
                  total={replaceVariablesInText(
                    templates.agegroup.total_people,
                    {
                      total: formatNumber(item.age_group_total),
                    }
                  )}
                  tooltipText={
                    (age_group_tooltips as Record<string, string>)[
                      item.age_group_range
                    ]
                  }
                  birthyear_range={formatBirthyearRangeString(
                    item.birthyear_range,
                    templates.birthyears
                  )}
                />
              </Cell>
              <Cell>
                <Percentage
                  value={item.fully_vaccinated_percentage}
                  color={COLOR_HAS_ONE_SHOT}
                />
              </Cell>
              <Cell>
                <Percentage
                  value={item.fully_vaccinated_percentage}
                  color={COLOR_FULLY_VACCINATED}
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <PercentageBar
                    percentage={item.fully_vaccinated_percentage}
                    height={8}
                    color={COLOR_HAS_ONE_SHOT}
                    hasFullWidthBackground
                  />
                  <PercentageBar
                    percentage={item.fully_vaccinated_percentage}
                    height={8}
                    color={COLOR_FULLY_VACCINATED}
                    hasFullWidthBackground
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

function Percentage({ value, color }: { value: number; color: string }) {
  const { formatPercentage } = useIntl();

  return (
    <InlineText
      variant="body2"
      textAlign="right"
      css={css({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pr: asResponsiveArray({ _: 3, xl: 4 }),
      })}
    >
      <Box
        width={10}
        height={10}
        backgroundColor={color}
        borderRadius="50%"
        mr={2}
      />
      {`${formatPercentage(value, {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })}%`}
    </InlineText>
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
