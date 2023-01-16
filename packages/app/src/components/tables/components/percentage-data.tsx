import { BehaviorTrend } from "~/domain/behavior/components/behavior-trend"
import { Box } from "~/components/base"
import { colors } from "@corona-dashboard/common"
import { NarrowPercentage } from "~/domain/vaccine/components/narrow-percentage"
import { PercentageBarWithoutNumber } from "./percentage-bar-without-number"
import { space } from "~/style/theme"

export type PercentageDataPoint = {
  title: string;
  trendDirection?: 'up' | 'down' | 'equal' | null;
  percentage: {
    color: string;
    value: number | string;
  };
};

interface PercentageDataProps {
  percentageDataPoints: PercentageDataPoint[];
}

export const PercentageData = ({percentageDataPoints}: PercentageDataProps) => {
  return (
    <>
      {percentageDataPoints.map((percentageDataPoint, index) => (
        <Box display="flex" flexDirection="column" marginBottom={index === 0 ? space[2] : undefined} key={index}>
          <Box display="flex" marginBottom={space[1]}>
            <NarrowPercentage
              value={ 
                percentageDataPoint.trendDirection ? (
                  <BehaviorTrend trend={percentageDataPoint.trendDirection} color={colors.black} text={`${percentageDataPoint.percentage.value}%`} />
                ) : percentageDataPoint.percentage.value
              }
              color={percentageDataPoint.percentage.color}
              textLabel={percentageDataPoint.title}
            />
          </Box>
          
          {/* In some cases, the percentage value is a string so it needs to be parsed for the progress bar to be filled properly. */}
          <PercentageBarWithoutNumber percentage={typeof percentageDataPoint.percentage.value === 'number' ? percentageDataPoint.percentage.value : parseFloat(percentageDataPoint.percentage.value)} color={percentageDataPoint.percentage.color} />
        </Box>
      ))}
    </>
  )
}