import React from 'react';
import IntakeHospital from '~/pages/gemeente/[code]/ziekenhuis-opnames';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Municipal } from '~/types/data';

xdescribe('Municipal page: IntakeHospital', () => {
  const data = loadFixture<Municipal>('GM0363.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <IntakeHospital
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );
    container = renderResult.container;
  });

  it('should use moving_average_hospital for hospital averages', () => {
    testKpiValue(
      container,
      'moving_average_hospital',
      formatNumber(data.hospital_admissions.last_value.moving_average_hospital)
    );
  });
});
