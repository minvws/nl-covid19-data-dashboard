import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { PercentageData } from './components/narrow-percentage-data';
import { Cell, HeaderCell, Row, Table } from './components/shared-styled-components';
import { CommonTableProps } from './types';

interface NarrowTableProps extends CommonTableProps {
  headerText: string;
}

/**
 * `NarrowTable` is a functional component that renders a table specifically for use on mobile screens.
 * It takes a `NarrowTableProps` object as its properties.
 *
 * @component
 * @param {Object} props - The properties that define the `NarrowTable` component.
 * @param {Array} props.tableData - An array of objects where each object represents a row in the table. Each object should include an `id` and a `firstColumnLabel`.
 * @param {string} props.headerText - The text to be displayed as the table's header.
 * @param {Array} props.percentageData - An array of objects where each object represents a percentage data point to be displayed in the table.
 *
 * @example
 * <NarrowTable tableData={tableData} headerText="Sample Table" percentageData={percentageData} />
 *
 * @extends {CommonTableProps}
 * @returns {React.Element} The rendered `NarrowTable` component.
 */
export const NarrowTable = ({ tableData, headerText, percentageData }: NarrowTableProps) => {
  return (
    <Box overflow="auto">
      <Table>
        <thead>
          <Row>
            <HeaderCell width="100%">{headerText}</HeaderCell>
          </Row>
        </thead>

        <tbody>
          {tableData.map((item, tableDataIndex) => (
            <Row key={`narrow-${item.id}`} display="flex">
              <Cell minWidth="100%">
                <Box display="flex" alignItems="center" marginBottom={space[2]}>
                  {item.firstColumnLabel}
                </Box>

                <Box display="flex" flexDirection="column">
                  <PercentageData percentageDataPoints={percentageData[tableDataIndex]} key={`narrow-${item.id}-${tableDataIndex}`} />
                </Box>
              </Cell>
            </Row>
          ))}
        </tbody>
      </Table>
    </Box>
  );
};
