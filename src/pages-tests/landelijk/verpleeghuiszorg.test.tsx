import React from 'react';
import NursingHomeCare from '~/pages/landelijk/verpleeghuiszorg';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { National } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

describe('National page: NursingHomeCare', () => {
  const data = loadFixture<National>('NL.json');

  it('should use newly_infected_people for newly infected people in a nursing home count', () => {
    const { container } = render(
      <NursingHomeCare data={data} lastGenerated="test" text={{}} />
    );

    const newlyInfectedText = getTextByDataCy(
      container,
      'newly_infected_people'
    );

    const value = formatNumber(
      data.nursing_home.last_value.newly_infected_people
    );

    expect(newlyInfectedText).toEqual(value);
  });

  it('should use infected_locations_total for infected location totals', () => {
    const { container } = render(
      <NursingHomeCare data={data} lastGenerated="test" text={{}} />
    );

    const newlyInfectedText = getTextByDataCy(
      container,
      'infected_locations_total'
    );

    const value = `${formatNumber(
      data.nursing_home.last_value.infected_locations_total
    )} (${formatPercentage(
      data.nursing_home.last_value.infected_locations_percentage
    )}%)`;

    expect(newlyInfectedText).toEqual(value);
  });

  it('should use newly_infected_locations for newly infected locations count', () => {
    const { container } = render(
      <NursingHomeCare data={data} lastGenerated="test" text={{}} />
    );

    const newlyInfectedText = getTextByDataCy(
      container,
      'newly_infected_locations'
    );

    const value = formatNumber(
      data.nursing_home.last_value.newly_infected_locations
    );

    expect(newlyInfectedText).toEqual(value);
  });

  it('should use deceased_daily for daily death count', () => {
    const { container } = render(
      <NursingHomeCare data={data} lastGenerated="test" text={{}} />
    );

    const newlyInfectedText = getTextByDataCy(container, 'deceased_daily');

    const value = formatNumber(data.nursing_home.last_value.deceased_daily);

    expect(newlyInfectedText).toEqual(value);
  });
});
