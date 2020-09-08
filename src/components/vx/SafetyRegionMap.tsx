import ParentSize from './ParentSize';
import SafetyRegionChloropleth from './SafetyRegionChloropleth';
import { TRegionMetricName } from 'utils/useRegionData';

export interface ISafetyRegionMapProps {
  selected?: string;
  metric: TRegionMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
}

export default function SafetyRegionMap(props: ISafetyRegionMapProps) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <SafetyRegionChloropleth width={width} height={height} {...props} />
      )}
    </ParentSize>
  );
}
