import React from 'react';
import InfectiousPeople from '~/pages/landelijk/besmettelijke-mensen';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: InfectiousPeople', () => {
  const data = loadFixture<National>('NL.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <InfectiousPeople data={data} lastGenerated="test" />
    );
    container = renderResult.container;
  });

  it('should use infectious_avg for estimated average', () => {
    testKpiValue(
      container,
      'infectious_avg',
      formatNumber(
        data.infectious_people_last_known_average.last_value.infectious_avg
      )
    );
  });
});
