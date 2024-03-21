import { colors } from '@corona-dashboard/common';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { PercentageData } from './components/wide-percentage-data';
import { Cell, HeaderCell, Table, TableHead } from './components/shared-styled-components';
import { CommonTableProps } from './types';
import { columnWidths } from '~/components/tables';

interface WideTableProps extends CommonTableProps {
  headerText: { [key: string]: string };
}

/**
 * WideTable is a React component that displays data in a desktop-width sized table.
 * It features customizable column widths and header texts, and supports the display
 * of percentage data for each row.
 *
 * @function WideTable
 *
 * @param {Object} props - The properties that define the WideTable component.
 * @param {Array} props.tableData - The data to be displayed in the table. Each element of the array represents a row and should contain an 'id' and a 'firstColumnLabel' property.
 * @param {Object} props.headerText - An object that defines the text for each column header. It should have properties 'firstColumn', 'secondColumn', 'thirdColumn', and 'fourthColumn'.
 * @param {Object} props.tableColumnWidths - An object that specifies the widths of the columns. Defaults to 'columnWidths.wide.default'. It should have properties 'labelColumn', 'percentageColumn', and 'percentageBarColumn'.
 * @param {Array} props.percentageData - The percentage data to be displayed in the table. Each element of the array corresponds to a row of table data.
 *
 * @returns {JSX.Element} - A JSX element representing a table with columns.
 */
export const WideTable = ({ tableData, headerText, tableColumnWidths = columnWidths.wide.default, percentageData }: WideTableProps) => {
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
              <PercentageData columnWidths={tableColumnWidths} percentageDataPoints={percentageData[tableDataIndex]} key={`wide-${item.id}-${tableDataIndex}`} />
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
