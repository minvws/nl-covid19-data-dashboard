import React from 'react';
import IntakeHospital from '~/pages/landelijk/ziekenhuis-opnames';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: IntakeHospital', () => {
  const data = loadFixture<National>('NL.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <IntakeHospital data={data} lastGenerated="test" />
    );
    container = renderResult.container;
  });

  it('should use covid_occupied for hospital bed count', () => {
    testKpiValue(
      container,
      'covid_occupied',
      formatNumber(data.hospital_beds_occupied.last_value.covid_occupied)
    );
  });
});
