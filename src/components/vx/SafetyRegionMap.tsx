import SafetyRegionChloropleth from './SafetyRegionChloropleth';
import { TRegionMetricName } from 'utils/useRegionData';
import useChartDimensions from './use-chart-dimensions';

export interface ISafetyRegionMapProps {
  selected?: string;
  metric: TRegionMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
}

const chartSettings = {
  marginBottom: 0,
};

export default function SafetyRegionMap(props: ISafetyRegionMapProps) {
  const [ref, dms] = useChartDimensions(chartSettings);

  const { width, height } = dms;

  return (
    <div ref={ref} style={{ height: '800px' }}>
      <SafetyRegionChloropleth width={width} height={height} {...props} />
    </div>
  );
}
