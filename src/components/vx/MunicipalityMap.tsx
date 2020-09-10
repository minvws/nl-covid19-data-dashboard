import MunicipalityChloropleth from './MunicipalityChloropleth';
import { TMunicipalityMetricName } from 'utils/useMunicipalityData';
import useChartDimensions from './use-chart-dimensions';

import styles from './chloropleth.module.scss';
import { CSSProperties } from 'react';

export interface IMunicipalityMapProps {
  selected?: string;
  metric?: TMunicipalityMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
  style?: CSSProperties;
}

export default function MunicipalityMap(props: IMunicipalityMapProps) {
  const [ref, dimensions] = useChartDimensions();

  return (
    <div
      ref={(elm) => {
        ref.current = elm;
      }}
      className={styles.chloroplethContainer}
      style={props.style}
    >
      <MunicipalityChloropleth dimensions={dimensions} {...props} />
    </div>
  );
}
