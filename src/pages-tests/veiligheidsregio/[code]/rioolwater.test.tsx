import React from 'react';
import SewerWater from '~/pages/veiligheidsregio/[code]/rioolwater';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Regional page: SewerWater', () => {
  const data = loadFixture<Regionaal>('VR13.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <SewerWater
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );
    container = renderResult.container;
  });

  it('should use average for sewerwater averages', () => {
    testKpiValue(
      container,
      'riool_normalized',
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
