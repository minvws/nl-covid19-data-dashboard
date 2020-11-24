import React from 'react';
import PositivelyTestedPeople from '~/pages/gemeente/[code]/positief-geteste-mensen';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Gemeente page: PositiefGetesteMensen', () => {
  const data = loadFixture<Municipal>('GM0363.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <PositivelyTestedPeople
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );
    container = renderResult.container;
  });

  it('should use infected_daily_increase for infected daily increase', () => {
    testKpiValue(
      container,
      'infected_daily_increase',
      formatNumber(
        data.positive_tested_people.last_value.infected_daily_increase
      )
    );
  });

  it('should use infected_daily_total for infected daily total', () => {
    testKpiValue(
      container,
      'infected_daily_total',
      formatNumber(data.positive_tested_people.last_value.infected_daily_total)
    );
  });
});
