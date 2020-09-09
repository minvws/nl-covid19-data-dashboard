import MunicipalityChloropleth from './MunicipalityChloropleth';
import { TMunicipalityMetricName } from 'utils/useMunicipalityData';
import useChartDimensions from './use-chart-dimensions';

import styles from './chloropleth.module.scss';

export interface IMunicipalityMapProps {
  selected?: string;
  metric?: TMunicipalityMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
}

export default function MunicipalityMap(props: IMunicipalityMapProps) {
  const [ref, dimensions] = useChartDimensions();

  return (
    <div ref={ref} className={styles.chloroplethContainer}>
      <MunicipalityChloropleth dimensions={dimensions} {...props} />
    </div>
  );
}
