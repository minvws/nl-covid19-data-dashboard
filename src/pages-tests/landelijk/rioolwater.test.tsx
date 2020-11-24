import React from 'react';
import SewerWater from '~/pages/landelijk/rioolwater';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: SewerWater', () => {
  const data = loadFixture<National>('NL.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <SewerWater data={data} lastGenerated="test" />
    );
    container = renderResult.container;
  });

  it('should use average for sewerwater averages', () => {
    testKpiValue(
      container,
      'sewer_average',
      formatNumber(data.sewer.last_value.average)
    );
  });

  it('should use total_installation_count for total installation count', () => {
    testKpiValue(
      container,
      'total_installation_count',
      formatNumber(data.sewer.last_value.total_installation_count)
    );
  });
});
