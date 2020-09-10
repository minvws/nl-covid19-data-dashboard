import SafetyRegionChloropleth from './SafetyRegionChloropleth';
import { TRegionMetricName } from 'utils/useRegionData';
import useChartDimensions from './use-chart-dimensions';

import styles from './chloropleth.module.scss';
import { CSSProperties } from 'react';

export interface ISafetyRegionMapProps {
  selected?: string;
  metric?: TRegionMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
  style?: CSSProperties;
}

const chartSettings = {
  marginBottom: 0,
};

export default function SafetyRegionMap(props: ISafetyRegionMapProps) {
  const [ref, dms] = useChartDimensions(chartSettings);

  return (
    <div
      ref={(elm) => {
        ref.current = elm;
      }}
      className={styles.chloroplethContainer}
      style={props.style}
    >
      <SafetyRegionChloropleth dimensions={dms} {...props} />
    </div>
  );
}
