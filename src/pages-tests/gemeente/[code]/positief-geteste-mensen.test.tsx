import React from 'react';
import PositivelyTestedPeople from '~/pages/gemeente/[code]/positief-geteste-mensen';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Gemeente page: PositiefGetesteMensen', () => {
  const data = loadFixture<Municipal>('GM0363.json');

  it('should use infected_daily_increase for infected daily increase', () => {
    const { container } = render(
      <PositivelyTestedPeople
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );

    const increaseText = getTextByDataCy(container, 'infected_daily_increase');

    const value = formatNumber(
      data.positive_tested_people.last_value.infected_daily_increase
    );

    expect(increaseText).toEqual(value);
  });

  it('should use infected_daily_total for infected daily total', () => {
    const { container } = render(
      <PositivelyTestedPeople
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );

    const increaseText = getTextByDataCy(container, 'infected_daily_total');

    const value = formatNumber(
      data.positive_tested_people.last_value.infected_daily_total
    );

    expect(increaseText).toEqual(value);
  });
});
