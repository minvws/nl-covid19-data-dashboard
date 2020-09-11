import SafetyRegionChloropleth from './SafetyRegionChloropleth';
import { TRegionMetricName } from 'utils/useRegionData';
import useChartDimensions from './use-chart-dimensions';

import styles from './chloropleth.module.scss';
import { CSSProperties, ReactNode } from 'react';
import { Regions } from 'types/data';

export interface ISafetyRegionMapProps<T extends TRegionMetricName> {
  selected?: string;
  metric?: T;
  metricProperty?: keyof Regions[T][number];
  gradient: string[];
  onSelect?: (context: any) => void;
  style?: CSSProperties;
  tooltipContent: (context: any) => ReactNode;
}

const chartSettings = {
  marginBottom: 0,
};

export default function SafetyRegionMap(props: ISafetyRegionMapProps<any>) {
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
