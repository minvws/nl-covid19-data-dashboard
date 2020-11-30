import React from 'react';
import IntakeHospital from '~/pages/veiligheidsregio/[code]/ziekenhuis-opnames';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

xdescribe('Regional page: NursingHomeCare', () => {
  const data = loadFixture<Regionaal>('VR13.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <IntakeHospital
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );
    container = renderResult.container;
  });

  it('should use newly_infected_people for newly infected count', () => {
    testKpiValue(
      container,
      'hospital_moving_avg_per_region',
      formatNumber(
        data.results_per_region.last_value.hospital_moving_avg_per_region
      )
    );
  });
});
