import React from 'react';
import PositiefGetesteMensen from '~/pages/veiligheidsregio/[code]/positief-geteste-mensen';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Safety region page: PositiefGetesteMensen', () => {
  const data = loadFixture<Regionaal>('VR13.json');

  it('should use total_reported_increase_per_region for Results per Region', () => {
    const { getByText } = render(
      <PositiefGetesteMensen
        data={data as Regionaal}
        lastGenerated="test"
        safetyRegionName="Friesland"
      />
    );

    const value =
      formatNumber(
        data?.results_per_region.last_value.total_reported_increase_per_region
      ) ?? '';

    getByText(value.toString());
  });

  it('should show a signaalwaarde', () => {
    const { getByText } = render(
      <PositiefGetesteMensen
        data={data as Regionaal}
        lastGenerated="test"
        safetyRegionName="Friesland"
      />
    );

    getByText(/signaalwaarde/i);
  });

  it("should show not show 'last week' option for GGD charts", () => {
    const { getAllByText } = render(
      <PositiefGetesteMensen
        data={data as Regionaal}
        lastGenerated="test"
        safetyRegionName="Friesland"
      />
    );

    /**
     * Currently there are three charts shown on the positief-geteste-mensen page,
     * two of those charts should NOT have the 'Laatste week' option available since
     * the data does not allow for it.
     * This test therefore checks if there is only ONE label element on the page
     * with this option.
     * This test is rather brittle, but for now the only way to do this test as a
     * way of a regression check.
     */
    const allLabels = getAllByText('Laatste week').filter(
      (node) => node instanceof HTMLLabelElement
    );

    expect(allLabels.length).toBe(1);
  });
});
