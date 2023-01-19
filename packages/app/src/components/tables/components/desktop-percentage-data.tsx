import { colors } from '@corona-dashboard/common';
import { Box } from '~/components/base';
import { BehaviorTrend } from '~/domain/behavior/components/behavior-trend';
import { WidePercentage } from '~/domain/vaccine/components/wide-percentage';
import { space } from '~/style/theme';
import { PercentageDataPoint } from '../types';
import { tableColumnWidths } from '../wide-table';
import { PercentageBarWithoutNumber } from './percentage-bar-without-number';
import { Cell } from './shared-styled-components';

interface PercentageDataProps {
  percentageDataPoints: PercentageDataPoint[];
}

export const PercentageData = ({ percentageDataPoints }: PercentageDataProps) => {
  return (
    <>
      {percentageDataPoints.map((percentageDataPoint, index) => (
        <Cell minWidth={tableColumnWidths.percentageColumn} border="0" key={index}>
          <WidePercentage
            value={
              percentageDataPoint.trendDirection ? (
                <BehaviorTrend trend={percentageDataPoint.trendDirection} color={colors.black} text={`${percentageDataPoint.percentage.value}%`} />
              ) : percentageDataPoint.percentage.value
            }
            color={percentageDataPoint.percentage.color}
            justifyContent="flex-start"
          />
        </Cell>
      ))}

      <Cell border="0">
        <Box display="flex" flexDirection="column">
          {percentageDataPoints.map((percentageDataPoint, index) => (
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
