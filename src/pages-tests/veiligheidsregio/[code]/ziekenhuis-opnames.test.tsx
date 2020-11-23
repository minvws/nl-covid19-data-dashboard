import React from 'react';
import IntakeHospital from '~/pages/veiligheidsregio/[code]/ziekenhuis-opnames';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Regional page: NursingHomeCare', () => {
  const data = loadFixture<Regionaal>('VR13.json');

  it('should use newly_infected_people for newly infected count', () => {
    const { container } = render(
      <IntakeHospital
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );

    const normalizedText = getTextByDataCy(
      container,
      'hospital_moving_avg_per_region'
    );

    const value = formatNumber(
      data.results_per_region.last_value.hospital_moving_avg_per_region
    );

    expect(normalizedText).toEqual(value);
  });
});
