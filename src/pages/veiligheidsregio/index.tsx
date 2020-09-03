import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
import SafetyRegionMap from 'components/mapChart/SafetyRegionMap';

const SafetyRegion: FCWithLayout = () => {
  return (
    <div className="column-item column-item-extra-margin">
      <SafetyRegionMap
        metric="positive_tested_people"
        gradient={['#9DDEFE', '#0290D6']}
      />
    </div>
  );
};

SafetyRegion.getLayout = getSafetyRegionLayout();

export default SafetyRegion;
