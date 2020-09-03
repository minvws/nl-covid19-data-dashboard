// import { useState } from 'react';

import { FCWithLayout } from 'components/layout';
import { getSafetyRegionLayout } from 'components/layout/SafetyRegionLayout';
// import MunicipalityMap from 'components/mapChart/MunicipalityMap';
import SafetyRegionMap from 'components/mapChart/SafetyRegionMap';
// import ChartRegionControls from 'components/chartRegionControls';

// import siteText from 'locale';

// const text: typeof siteText.positief_geteste_personen =
//   siteText.positief_geteste_personen;

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
