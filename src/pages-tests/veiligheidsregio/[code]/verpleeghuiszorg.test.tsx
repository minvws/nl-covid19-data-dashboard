import React from 'react';
import NursingHomeCare from '~/pages/veiligheidsregio/[code]/verpleeghuiszorg';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { Regionaal } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

describe('Regional page: NursingHomeCare', () => {
  const data = loadFixture<Regionaal>('VR13.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <NursingHomeCare
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );
    container = renderResult.container;
  });

  it('should use newly_infected_people for newly infected count', () => {
    testKpiValue(
      container,
      'newly_infected_people',
      formatNumber(data.nursing_home.last_value.newly_infected_people)
    );
  });

  it('should use infected_locations_total and infected_locations_percentage for infected locations', () => {
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

  it('should use newly_infected_locations for newly infected locations', () => {
    testKpiValue(
      container,
      'newly_infected_locations',
      formatNumber(data.nursing_home.last_value.newly_infected_locations)
    );
  });

  it('should use deceased_daily for daily deceased count', () => {
    testKpiValue(
      container,
      'deceased_daily',
      formatNumber(data.nursing_home.last_value.deceased_daily)
    );
  });
});
