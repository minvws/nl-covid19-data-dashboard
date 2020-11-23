import React from 'react';
import SewerWater from '~/pages/landelijk/rioolwater';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: SewerWater', () => {
  const data = loadFixture<National>('NL.json');

  it('should use average for sewerwater averages', () => {
    const { container } = render(
      <SewerWater data={data} lastGenerated="test" text={{}} />
    );

    const occupiedText = getTextByDataCy(container, 'sewer_average');

    const value = formatNumber(data.sewer.last_value.average);

    expect(occupiedText).toEqual(value);
  });

  it('should use total_installation_count for total installation count', () => {
    const { container } = render(
      <SewerWater data={data} lastGenerated="test" text={{}} />
    );

    const occupiedText = getTextByDataCy(container, 'total_installation_count');

    const value = formatNumber(data.sewer.last_value.total_installation_count);

    expect(occupiedText).toEqual(value);
  });
});
