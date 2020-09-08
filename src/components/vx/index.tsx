import MunicipalityMap from './MunicipalityMap';
import { TMunicipalityMetricName } from 'utils/useMunicipalityData';

import useChartDimensions from './use-chart-dimensions';

export interface IProps {
  selected?: string;
  metric: TMunicipalityMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
}

const chartSettings = {
  marginBottom: 0,
};

export default function ResponsiveMap(props: IProps) {
  const [ref, dms] = useChartDimensions(chartSettings);

  const { width, height } = dms;

  console.log(width, height);
  return (
    <div ref={ref} style={{ height: '800px' }}>
      <MunicipalityMap width={width} height={height} {...props} />
    </div>
  );
}
/*
 */
