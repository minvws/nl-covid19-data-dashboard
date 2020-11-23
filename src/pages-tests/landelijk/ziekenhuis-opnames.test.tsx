import React from 'react';
import IntakeHospital from '~/pages/landelijk/ziekenhuis-opnames';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: IntakeHospital', () => {
  const data = loadFixture<National>('NL.json');

  it('should use covid_occupied for hospital bed count', () => {
    const { container } = render(
      <IntakeHospital data={data} lastGenerated="test" text={{}} />
    );

    const occupiedText = getTextByDataCy(container, 'covid_occupied');

    const value = formatNumber(
      data.hospital_beds_occupied.last_value.covid_occupied
    );

    expect(occupiedText).toEqual(value);
  });
});
