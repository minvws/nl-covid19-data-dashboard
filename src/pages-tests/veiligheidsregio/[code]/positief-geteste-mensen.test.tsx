import { ByRoleMatcher, Matcher } from '@testing-library/react';
import React from 'react';
import PositiefGetesteMensen from '~/pages/veiligheidsregio/[code]/positief-geteste-mensen';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kip-value';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Safety region page: PositiefGetesteMensen', () => {
  const data = loadFixture<Regionaal>('VR13.json');
  let container: HTMLElement;
  let getByText: (text: Matcher, options?: any) => HTMLElement;
  let getAllByRole: (
    text: ByRoleMatcher,
    options?: any,
    waitforoptions?: any
  ) => HTMLElement[];

  beforeEach(() => {
    const renderResult = render(
      <PositiefGetesteMensen
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );
    container = renderResult.container;
    getByText = renderResult.getByText;
    getAllByRole = renderResult.getAllByRole;
  });

  it('should use total_reported_increase_per_region for Results per Region', () => {
    testKpiValue(
      container,
      'total_reported_increase_per_region',
      formatNumber(
        data.results_per_region.last_value.total_reported_increase_per_region
      )
    );
  });

  it('should show a signaalwaarde', () => {
    getByText(/signaalwaarde/i);
  });

  it("should show not show 'last week' option for GGD charts", () => {
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
