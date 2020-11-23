import React from 'react';
import InfectiousPeople from '~/pages/landelijk/besmettelijke-mensen';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: InfectiousPeople', () => {
  const data = loadFixture<National>('NL.json');

  it('should use infectious_avg for estimated average', () => {
    const { container } = render(
      <InfectiousPeople data={data} lastGenerated="test" text={{}} />
    );

    const infectiousAvgText = getTextByDataCy(container, 'infectious_avg');

    const value = formatNumber(
      data.infectious_people_last_known_average.last_value.infectious_avg
    );

    expect(infectiousAvgText).toEqual(value);
  });
});
