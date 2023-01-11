import { Box } from '~/components/base';
import { PercentageBar } from '~/components/percentage-bar';

interface PercentageBarWithoutNumberProps { 
  color: string;
  percentage: number;
  marginBottom?: string;
}

export const PercentageBarWithoutNumber = ({ color, percentage, marginBottom }: PercentageBarWithoutNumberProps) => {
  return (
    <Box display="flex" alignItems="center" spacingHorizontal={2} marginBottom={marginBottom}>
      <Box color={color} flexGrow={1}>
        <PercentageBar percentage={percentage} height="8px" />
      </Box>
    </Box>
  );
}