import React from 'react';
import NursingHomeCare from '~/pages/veiligheidsregio/[code]/verpleeghuiszorg';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Regionaal } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

describe('Regional page: NursingHomeCare', () => {
  const data = loadFixture<Regionaal>('VR13.json');

  it('should use newly_infected_people for newly infected count', () => {
    const { container } = render(
      <NursingHomeCare
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );

    const normalizedText = getTextByDataCy(container, 'newly_infected_people');

    const value = formatNumber(
      data.nursing_home.last_value.newly_infected_people
    );

    expect(normalizedText).toEqual(value);
  });

  it('should use infected_locations_total and infected_locations_percentage for infected locations', () => {
    const { container } = render(
      <NursingHomeCare
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );

    const normalizedText = getTextByDataCy(
      container,
      'infected_locations_total'
    );

    const value = `${formatNumber(
      data.nursing_home.last_value.infected_locations_total
    )} (${formatPercentage(
      data.nursing_home.last_value.infected_locations_percentage
    )}%)`;

    expect(normalizedText).toEqual(value);
  });

  it('should use newly_infected_locations for newly infected locations', () => {
    const { container } = render(
      <NursingHomeCare
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );

    const normalizedText = getTextByDataCy(
      container,
      'newly_infected_locations'
    );

    const value = formatNumber(
      data.nursing_home.last_value.newly_infected_locations
    );

    expect(normalizedText).toEqual(value);
  });

  it('should use deceased_daily for daily deceased count', () => {
    const { container } = render(
      <NursingHomeCare
        data={data}
        lastGenerated="test"
        safetyRegionName={'Test Region'}
      />
    );

    const normalizedText = getTextByDataCy(container, 'deceased_daily');

    const value = formatNumber(data.nursing_home.last_value.deceased_daily);

    expect(normalizedText).toEqual(value);
  });
});
