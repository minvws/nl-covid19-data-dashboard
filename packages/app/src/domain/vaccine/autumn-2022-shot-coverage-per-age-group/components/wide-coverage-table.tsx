import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import {
  COLOR_FULLY_VACCINATED,
  COLOR_AUTUMN_2022_SHOT,
} from '~/domain/vaccine/common';
import { Bar } from '~/domain/vaccine/components/bar';
import { WidePercentage } from '~/domain/vaccine/components/wide-percentage';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { SiteText } from '~/locale';
interface WideCoverageTableProps {
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
  values: NlVaccineCoveragePerAgeGroupValue[];
}

export const WideCoverageTable = ({ values, text }: WideCoverageTableProps) => {
  const { commonTexts, formatPercentage } = useIntl();

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
                {text.headers.autumn_2022_shot}
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
                {text.headers.fully_vaccinated}
              </InlineText>
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
                {text.headers.difference_autumn_2022_shot_and_fully_vaccinated}
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
                    item.autumn_2022_vaccinated_percentage !== null
                      ? `${formatPercentage(
                          item.autumn_2022_vaccinated_percentage
                        )}%`
                      : text.no_data
                  }
                  color={COLOR_AUTUMN_2022_SHOT}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <WidePercentage
                  value={`${formatPercentage(
                    item.fully_vaccinated_percentage
                  )}%`}
                  color={COLOR_FULLY_VACCINATED}
                  justifyContent="flex-end"
                />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <Bar
                    value={item.autumn_2022_vaccinated_percentage}
                    color={COLOR_AUTUMN_2022_SHOT}
                  />
                  <Bar
                    value={item.fully_vaccinated_percentage}
                    color={COLOR_FULLY_VACCINATED}
                  />
                </Box>
              </Cell>
            </Row>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  );
};

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

const HeaderCell = styled.th<{ isColumn?: boolean }>((headerCellProps) =>
  css({
    textAlign: 'left',
    fontWeight: headerCellProps.isColumn ? 'normal' : 'bold',
    verticalAlign: 'middle',
    pb: headerCellProps.isColumn ? undefined : 2,
    py: headerCellProps.isColumn ? 3 : undefined,
  })
);

const Cell = styled.td(
  css({
    py: 3,
    verticalAlign: 'middle',
  })
);
