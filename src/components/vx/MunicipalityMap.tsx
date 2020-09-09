import MunicipalityChloropleth from './MunicipalityChloropleth';
import { TMunicipalityMetricName } from 'utils/useMunicipalityData';
import useChartDimensions from './use-chart-dimensions';

import styles from './chloropleth.module.scss';

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
    <div ref={ref} className={styles.chloroplethContainer}>
      <MunicipalityChloropleth width={width} height={height} {...props} />
    </div>
  );
}
