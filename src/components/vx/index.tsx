import ParentSize from './ParentSize';
import MunicipalityMap from './MunicipalityMap';
import { TMunicipalityMetricName } from 'utils/useMunicipalityData';

export interface IProps {
  selected?: string;
  metric: TMunicipalityMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
}

export default function ResponsiveMap(props: IProps) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <MunicipalityMap width={width - 10} height={height - 10} {...props} />
      )}
    </ParentSize>
  );
}
/*
 */
