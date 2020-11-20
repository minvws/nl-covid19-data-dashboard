import React from 'react';
import PositiefGetesteMensen from '~/pages/landelijk/positief-geteste-mensen';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: PositiefGetesteMensen', () => {
  const data = loadFixture<National>('NL.json');

  it('should use infected_daily_total for Results per Region', () => {
    const { getByText } = render(
      <PositiefGetesteMensen
        data={data as National}
        lastGenerated="test"
        text={{}}
      />
    );

    const value =
      formatNumber(
        data?.infected_people_total.last_value.infected_daily_total
      ) ?? '';

    getByText(value);
  });

  it('should show a signaalwaarde', () => {
    const { getByText } = render(
      <PositiefGetesteMensen
        data={data as National}
        lastGenerated="test"
        text={{}}
      />
    );

    getByText(/signaalwaarde/i);
  });

  it("should show not show 'last week' option for GGD charts", () => {
    const { getAllByText } = render(
      <PositiefGetesteMensen data={data as National} lastGenerated="test" />
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
