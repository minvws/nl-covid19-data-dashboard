import React from 'react';
import SuspectedPatients from '~/pages/landelijk/verdenkingen-huisartsen';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: SuspectedPatients', () => {
  const data = loadFixture<National>('NL.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <SuspectedPatients data={data} lastGenerated="test" />
    );
    container = renderResult.container;
  });

  it('should use geschat_aantal for suspected patients estimation', () => {
    testKpiValue(
      container,
      'geschat_aantal',
      formatNumber(data.verdenkingen_huisartsen.last_value.geschat_aantal)
    );
  });

  it('should use incidentie for suspected patients normalized count', () => {
    testKpiValue(
      container,
      'incidentie',
      formatNumber(data.verdenkingen_huisartsen.last_value.incidentie)
    );
  });
});
