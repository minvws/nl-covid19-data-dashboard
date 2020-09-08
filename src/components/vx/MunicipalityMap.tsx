import ParentSize from './ParentSize';
import MunicipalityChloropleth from './MunicipalityChloropleth';
import { TMunicipalityMetricName } from 'utils/useMunicipalityData';

export interface IResponsiveMunicipalityMapProps {
  selected?: string;
  metric?: TMunicipalityMetricName;
  gradient: [minColor: string, maxColor: string];
  onSelect?: (context: any) => void;
}

export default function MunicipalityMap(
  props: IResponsiveMunicipalityMapProps
) {
  return (
    <ParentSize>
      {({ width, height }) => (
        <MunicipalityChloropleth width={width} height={height} {...props} />
      )}
    </ParentSize>
  );
}
/*
 */
