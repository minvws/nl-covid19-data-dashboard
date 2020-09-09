import SafetyRegionChloropleth from './SafetyRegionChloropleth';
import { TRegionMetricName } from 'utils/useRegionData';
import useChartDimensions from './use-chart-dimensions';

import styles from './chloropleth.module.scss';

export interface ISafetyRegionMapProps {
  selected?: string;
  metric?: TRegionMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
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
    >
      <SafetyRegionChloropleth dimensions={dms} {...props} />
    </div>
  );
}
