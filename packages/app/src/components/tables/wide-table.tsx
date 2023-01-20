import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { InlineText } from '~/components/typography';
import { BehaviorIcon } from '~/domain/behavior/components/behavior-icon';
import { AgeGroup } from '~/domain/vaccine/components/age-group';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { formatAgeGroupString } from '~/utils/format-age-group-string';
import { formatBirthyearRangeString } from '~/utils/format-birthyear-range-string';
import { PercentageData } from './components/desktop-percentage-data';
import { BehaviorAnchor, Cell, HeaderCell, Table, TableHead } from './components/shared-styled-components';
import { CommonTableProps } from './types';

export const tableColumnWidths = {
  labelColumn: '30%',
  percentageColumn: '20%',
  percentageBarColumn: '30%',
};

interface WideTableProps extends CommonTableProps {
  headerText: { [key: string]: string };
  tableData: any[]; // TODO:AP - figure out how to properly type this
}

// Component shown for tables on wide screens.
export const WideTable = ({ tableData, headerText, hasAgeGroups, hasIcon, percentageData, onClickConfig }: WideTableProps) => {
  const { commonTexts } = useIntl();

  return (
    <Box overflow="auto">
      <Table>
        <TableHead>
          <Row>
            <HeaderCell minWidth="300px" width={tableColumnWidths.labelColumn}>
              {headerText.firstColumn}
            </HeaderCell>
            <HeaderCell minWidth="150px" width={tableColumnWidths.percentageColumn}>
              {headerText.secondColumn}
            </HeaderCell>
            <HeaderCell minWidth="150px" width={tableColumnWidths.percentageColumn}>
              {headerText.thirdColumn}
            </HeaderCell>
            <HeaderCell width={tableColumnWidths.percentageBarColumn}>{headerText.fourthColumn}</HeaderCell>
          </Row>
        </TableHead>

        <tbody>
          {tableData.map((item, tableDataIndex) => (
            <Row key={`wide-${item.id}`}>
              <Cell minWidth={tableColumnWidths.labelColumn} border="0">
                {hasIcon && (
                  <Box display="flex">
                    <Box minWidth="32px" color="black" paddingRight={space[2]} display="flex">
                      <BehaviorIcon name={item.id} size={25} />
                    </Box>

                    <BehaviorAnchor as="button" underline="hover" color="black" onClick={onClickConfig ? () => onClickConfig.handler(item.id, onClickConfig.scrollRef) : undefined}>
                      <Box as="span" display="flex" alignItems="center" textAlign="left" flexWrap="wrap">
                        <InlineText>{item.description}</InlineText>
                      </Box>
                    </BehaviorAnchor>
                  </Box>
                )}

                {hasAgeGroups && item?.ageGroupRange && item?.birthYearRange && (
                  <AgeGroup
                    range={formatAgeGroupString(item.ageGroupRange, commonTexts.common.agegroup)}
                    ageGroupTotal={item.ageGroupTotal ? item.ageGroupTotal : undefined}
                    birthyear_range={formatBirthyearRangeString(item.birthYearRange, commonTexts.common.birthyears)}
                    text={commonTexts.common.agegroup.total_people}
                  />
                )}
              </Cell>

              {percentageData.map(
                (percentageDataPoints, percentageDataIndex) =>
                  percentageDataIndex === tableDataIndex && <PercentageData percentageDataPoints={percentageDataPoints} key={`wide-${item.id}-${percentageDataIndex}`} />
              )}
            </Row>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};

const Row = styled.tr`
  border-bottom: 1px solid ${colors.gray2};
`;
