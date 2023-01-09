import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { Bar } from '~/domain/vaccine/components/bar';
import { Box } from '~/components/base';
import { COLOR_FULLY_VACCINATED, COLOR_AUTUMN_2022_SHOT } from '~/domain/vaccine/common';
import { fontWeights, space, fontSizes } from '~/style/theme';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { InlineText } from '~/components/typography';
import { NlVaccineCoveragePerAgeGroupValue } from '@corona-dashboard/common';
import { SiteText } from '~/locale';
import { useIntl } from '~/intl';
import { WidePercentage } from '~/domain/vaccine/components/wide-percentage';
import styled from 'styled-components';

interface WideCoverageTableProps {
  text: SiteText['pages']['vaccinations_page']['nl']['vaccination_coverage'];
  values: NlVaccineCoveragePerAgeGroupValue[];
}

export const WideCoverageTable = ({ values, text }: WideCoverageTableProps) => {
  const { commonTexts, formatPercentage } = useIntl();

  return (
    <Box overflow="auto">
      <StyledTable>
        <TableHead>
          <Row>
            <HeaderCell width="30%">
              <InlineText variant="label1">{text.headers.agegroup}</InlineText>
            </HeaderCell>
            <HeaderCell hasPaddingRight width="20%">
              <InlineText variant="label1">{text.headers.autumn_2022_shot}</InlineText>
            </HeaderCell>
            <HeaderCell hasPaddingRight width="20%">
              <InlineText variant="label1">{text.headers.fully_vaccinated}</InlineText>
            </HeaderCell>
            <HeaderCell width="30%"></HeaderCell>
          </Row>
        </TableHead>

        <tbody>
          {values.map((item, index) => (
            <Row key={index}>
              <HeaderCell isColumn>
                <AgeGroup
                  ageGroupTotal={'age_group_total' in item ? item.age_group_total : undefined}
                  text={commonTexts.common.agegroup.total_people}
                  range={formatAgeGroupString(item.age_group_range, commonTexts.common.agegroup)}
                  birthyear_range={formatBirthyearRangeString(item.birthyear_range, commonTexts.common.birthyears)}
                />
              </HeaderCell>
              <Cell>
                <WidePercentage
                  value={item.autumn_2022_vaccinated_percentage !== null ? `${formatPercentage(item.autumn_2022_vaccinated_percentage)}%` : text.no_data}
                  color={COLOR_AUTUMN_2022_SHOT}
                  justifyContent="flex-start"
                />
              </Cell>
              <Cell>
                <WidePercentage value={`${formatPercentage(item.fully_vaccinated_percentage)}%`} color={COLOR_FULLY_VACCINATED} justifyContent="flex-start" />
              </Cell>
              <Cell>
                <Box spacing={1}>
                  <Bar value={item.autumn_2022_vaccinated_percentage} color={COLOR_AUTUMN_2022_SHOT} />
                  <Bar value={item.fully_vaccinated_percentage} color={COLOR_FULLY_VACCINATED} />
                </Box>
              </Cell>
            </Row>
          ))}
        </tbody>
      </StyledTable>
    </Box>
  );
};

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const Row = styled.tr`
  border-bottom: 1px solid silver;
`;
interface HeaderCellProps {
  isColumn?: boolean;
  hasPaddingRight?: boolean;
  width?: string;
}

const HeaderCell = styled.th<HeaderCellProps>`
  font-weight: ${({ isColumn }) => (isColumn ? fontWeights.normal : fontWeights.bold)};
  padding-block: ${({ isColumn }) => (isColumn ? space[3] : undefined)};
  padding-bottom: ${({ isColumn }) => (isColumn ? undefined : space[2])};
  padding-right: ${({ hasPaddingRight }) => (hasPaddingRight ? space[3] : undefined)};
  text-align: left;
  vertical-align: middle;
  width: ${({ width }) => (width ? width : undefined)};

  > span {
    font-size: ${fontSizes[2]};
  }
`;

const Cell = styled.td`
  padding-block: ${space[3]};
  vertical-align: middle;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid silver;
`;
