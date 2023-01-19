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
  labelColumn: '300px',
  percentageColumn: '150px',
  percentageBarColumn: '20%'
}

interface WideTableProps extends CommonTableProps {
  headerText: { [key: string]: string }; // Covert this to an object
  tableData: any[]; // TODO:AP - figure out how to properly type this. Create an interface for it which requires only the data actually used in this component.
}

// Component shown for tables on wide screens.
export const WideTable = ({ tableData, headerText, hasAgeGroups, hasIcon, percentageData, onClickConfig }: WideTableProps) => {
  const { commonTexts } = useIntl();

  return (
    <Box overflow="auto">
      <Table>
        <TableHead>
          <Row>
            <HeaderCell width={tableColumnWidths.labelColumn}>{headerText.firstColumn} - Desktop table</HeaderCell>
            <HeaderCell width={tableColumnWidths.percentageColumn}>{headerText.secondColumn}</HeaderCell>
            <HeaderCell width={tableColumnWidths.percentageColumn}>{headerText.thirdColumn}</HeaderCell>
            <HeaderCell width={tableColumnWidths.percentageBarColumn}>{headerText.fourthColumn}</HeaderCell>
          </Row>
        </TableHead>

        <tbody>
          {tableData.map((item, tableDataIndex) => (
            <Row key={`wide-${item.id}`}>
              <Cell minWidth={tableColumnWidths.labelColumn} border="0">
                { hasIcon && (
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

                { hasAgeGroups && (
                    <AgeGroup
                      ageGroupTotal={'age_group_total' in item ? item.age_group_total : undefined}
                      text={commonTexts.common.agegroup.total_people}
                      range={formatAgeGroupString(item.age_group_range, commonTexts.common.agegroup)}
                      birthyear_range={formatBirthyearRangeString(item.birthyear_range, commonTexts.common.birthyears)}
                    />
                  )
                }
              </Cell>

              {percentageData.map((percentageDataPoints, percentageDataIndex) => (
                percentageDataIndex === tableDataIndex && <PercentageData percentageDataPoints={percentageDataPoints} key={`wide-${item.id}-${percentageDataIndex}`} />
              ))}
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
