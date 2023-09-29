import { Box } from '~/components/base';
import { space } from '~/style/theme';
import { PercentageData } from './components/narrow-percentage-data';
import { Cell, HeaderCell, Row, Table } from './components/shared-styled-components';
import { CommonTableProps, BaseCoverageTable } from './types';

interface NarrowTableProps<T extends BaseCoverageTable> extends CommonTableProps<T> {
  headerText: string;
}

// Component shown for tables on narrow screens.
export const NarrowTable = <T extends BaseCoverageTable>({ tableData, headerText, percentageData }: NarrowTableProps<T>) => {
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
