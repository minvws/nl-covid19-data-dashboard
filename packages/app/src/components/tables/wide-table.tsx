import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { PercentageData } from './components/wide-percentage-data';
import { Cell, HeaderCell, Table, TableHead } from './components/shared-styled-components';
import { CommonTableProps } from './types';

export const tableColumnWidths = {
  labelColumn: '30%',
  percentageColumn: '20%',
  percentageBarColumn: '30%',
};

interface WideTableProps extends CommonTableProps {
  headerText: { [key: string]: string };
}

// Component shown for tables on wide screens.
export const WideTable = ({ tableData, headerText, percentageData }: WideTableProps) => {
  return (
    <Box overflow="auto">
      <Table>
        <TableHead>
          <Row>
            {headerText.firstColumn !== undefined && (
              <HeaderCell minWidth="300px" width={tableColumnWidths.labelColumn}>
                {headerText.firstColumn}
              </HeaderCell>
            )}
            {headerText.secondColumn !== undefined && (
              <HeaderCell minWidth="150px" width={tableColumnWidths.percentageColumn}>
                {headerText.secondColumn}
              </HeaderCell>
            )}
            {headerText.thirdColumn !== undefined && (
              <HeaderCell minWidth="150px" width={tableColumnWidths.percentageColumn}>
                {headerText.thirdColumn}
              </HeaderCell>
            )}
            {headerText.fourthColumn !== undefined && <HeaderCell width={tableColumnWidths.percentageBarColumn}>{headerText.fourthColumn}</HeaderCell>}
          </Row>
        </TableHead>

        <tbody>
          {tableData.map((item, tableDataIndex) => (
            <Row key={`wide-${item.id}`}>
              <Cell minWidth={tableColumnWidths.labelColumn} border="0">
                {item.firstColumnLabel}
              </Cell>
              <PercentageData percentageDataPoints={percentageData[tableDataIndex]} key={`wide-${item.id}-${tableDataIndex}`} />
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
