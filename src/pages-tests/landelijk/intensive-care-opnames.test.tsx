import React from 'react';
import IntakeIntensiveCare from '~/pages/landelijk/intensive-care-opnames';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { National } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

describe('National page: IntakeIntensiveCare', () => {
  const data = loadFixture<National>('NL.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <IntakeIntensiveCare data={data} lastGenerated="test" />
    );
    container = renderResult.container;
  });

  it('should use covid_occupied for occupied beds', () => {
    testKpiValue(
      container,
      'covid_occupied',
      `${formatNumber(
        data.intensive_care_beds_occupied.last_value.covid_occupied
      )} (${formatPercentage(
        data.intensive_care_beds_occupied.last_value
          .covid_percentage_of_all_occupied
      )}%)`
    );
  });
});
