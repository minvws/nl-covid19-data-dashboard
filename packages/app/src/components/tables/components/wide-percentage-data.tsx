import { Box } from '~/components/base';
import { BehaviorTrend } from '~/domain/behavior/components/behavior-trend';
import { WidePercentage } from '~/components/tables/components/wide-percentage';
import { space } from '~/style/theme';
import { PercentageDataPoint, TableColumnWidths } from '../types';
import { PercentageBarWithoutNumber } from './percentage-bar-without-number';
import { Cell } from './shared-styled-components';

interface PercentageDataProps {
  percentageDataPoints: PercentageDataPoint[];
  columnWidths: TableColumnWidths;
}

// Component used to show percentages on wide screens.
export const PercentageData = ({ percentageDataPoints, columnWidths }: PercentageDataProps) => {
  return (
    <>
      {percentageDataPoints.map((percentageDataPoint, index) => (
        <Cell minWidth={columnWidths.percentageColumn} border="0" key={index}>
          <WidePercentage
            value={
              percentageDataPoint.trendDirection ? (
                <BehaviorTrend trend={percentageDataPoint.trendDirection} text={`${percentageDataPoint.percentage.value}%`} />
              ) : (
                percentageDataPoint.percentage.value
              )
            }
            color={percentageDataPoint.percentage.color}
            justifyContent="flex-start"
          />
        </Cell>
      ))}

      <Cell minWidth={columnWidths.percentageBarColumn} border="0">
        <Box display="flex" flexDirection="column">
          {percentageDataPoints.map((percentageDataPoint, index) => (
            // In some cases, the percentage value is a string so it needs to be parsed for the progress bar to be filled properly.
            <PercentageBarWithoutNumber
              key={index}
              percentage={typeof percentageDataPoint.percentage.value === 'number' ? percentageDataPoint.percentage.value : parseFloat(percentageDataPoint.percentage.value)}
              color={percentageDataPoint.percentage.color}
              marginBottom={index === 0 ? space[2] : undefined}
            />
          ))}
        </Box>
      </Cell>
    </>
  );
};
