import React from 'react';
import SewerWater from '~/pages/veiligheidsregio/[code]/rioolwater';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Regional page: SewerWater', () => {
  const data = loadFixture<Regionaal>('VR13.json');

  it('should use average for sewerwater averages', () => {
    const { container } = render(
      <SewerWater
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );

    const normalizedText = getTextByDataCy(container, 'riool_normalized');

    const value = formatNumber(data.sewer.last_value.average);

    expect(normalizedText).toEqual(value);
  });

  it('should use total_installation_count for total installation count', () => {
    const { container } = render(
      <SewerWater
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );

    const normalizedText = getTextByDataCy(
      container,
      'total_installation_count'
    );

    const value = formatNumber(data.sewer.last_value.total_installation_count);

    expect(normalizedText).toEqual(value);
  });
});
