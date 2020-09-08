import MunicipalityChloropleth from './MunicipalityChloropleth';
import { TMunicipalityMetricName } from 'utils/useMunicipalityData';
import useChartDimensions from './use-chart-dimensions';

export interface IResponsiveMunicipalityMapProps {
  selected?: string;
  metric?: TMunicipalityMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
}

const chartSettings = {
  marginBottom: 0,
};

export default function ResponsiveMap(props: IResponsiveMunicipalityMapProps) {
  const [ref, dms] = useChartDimensions(chartSettings);

  const { width, height } = dms;

  return (
    <div ref={ref} style={{ height: '800px', position: 'relative' }}>
      <MunicipalityChloropleth width={width} height={height} {...props} />
    </div>
  );
}
