import React from 'react';
import NursingHomeCare from '~/pages/landelijk/verpleeghuiszorg';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { National } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

describe('National page: NursingHomeCare', () => {
  const data = loadFixture<National>('NL.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <NursingHomeCare data={data} lastGenerated="test" />
    );
    container = renderResult.container;
  });

  it('should use newly_infected_people for newly infected people in a nursing home count', () => {
    testKpiValue(
      container,
      'newly_infected_people',
      formatNumber(data.nursing_home.last_value.newly_infected_people)
    );
  });

  it('should use infected_locations_total for infected location totals', () => {
    testKpiValue(
      container,
      'infected_locations_total',
      `${formatNumber(
        data.nursing_home.last_value.infected_locations_total
      )} (${formatPercentage(
        data.nursing_home.last_value.infected_locations_percentage
      )}%)`
    );
  });

  it('should use newly_infected_locations for newly infected locations count', () => {
    testKpiValue(
      container,
      'newly_infected_locations',
      formatNumber(data.nursing_home.last_value.newly_infected_locations)
    );
  });

  it('should use deceased_daily for daily death count', () => {
    testKpiValue(
      container,
      'deceased_daily',
      formatNumber(data.nursing_home.last_value.deceased_daily)
    );
  });
});
