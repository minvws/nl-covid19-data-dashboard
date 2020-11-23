import React from 'react';
import IntakeIntensiveCare from '~/pages/landelijk/intensive-care-opnames';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { National } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

describe('National page: IntakeIntensiveCare', () => {
  const data = loadFixture<National>('NL.json');

  it('should use covid_occupied for occupied beds', () => {
    const { container } = render(
      <IntakeIntensiveCare data={data} lastGenerated="test" text={{}} />
    );

    const occupiedText = getTextByDataCy(container, 'covid_occupied');

    const value = `${formatNumber(
      data.intensive_care_beds_occupied.last_value.covid_occupied
    )} (${formatPercentage(
      data.intensive_care_beds_occupied.last_value
        .covid_percentage_of_all_occupied
    )}%)`;

    expect(occupiedText).toEqual(value);
  });
});
