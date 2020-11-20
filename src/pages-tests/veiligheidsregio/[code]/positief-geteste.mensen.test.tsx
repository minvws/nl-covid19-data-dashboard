import React from 'react';
import PositiefGetesteMensen from '~/pages/veiligheidsregio/[code]/positief-geteste-mensen';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Safety region page: PositiefGetesteMensen', () => {
  const data = loadFixture<Regionaal>('VR13.json');

  it('should use total_reported_increase_per_region for Results per Region', () => {
    const { container } = render(
      <PositiefGetesteMensen
        data={data as Regionaal}
        lastGenerated="test"
        safetyRegionName="Friesland"
      />
    );

    const elm = container.querySelector(
      '[data-cy="total_reported_increase_per_region"]'
    );

    const value =
      formatNumber(
        data?.results_per_region.last_value.total_reported_increase_per_region
      ) ?? '';

    expect(elm?.textContent).toEqual(value);
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
    const { getAllByRole } = render(
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
     * This test therefore checks if there is only ONE radio element on the page
     * with a value of 'week'.
     * This test is rather brittle, but for now the only way to do this test as a
     * way of a regression check.
     */
    const allRadios = getAllByRole('radio').filter(
      (elm) => (elm as HTMLInputElement).value === 'week'
    );

    expect(allRadios.length).toBe(1);
  });
});
