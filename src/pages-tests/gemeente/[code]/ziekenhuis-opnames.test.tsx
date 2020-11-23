import React from 'react';
import IntakeHospital from '~/pages/gemeente/[code]/ziekenhuis-opnames';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Municipal page: IntakeHospital', () => {
  const data = loadFixture<Municipal>('GM0363.json');

  it('should use moving_average_hospital for hospital averages', () => {
    const { container } = render(
      <IntakeHospital
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );

    const normalizedText = getTextByDataCy(
      container,
      'moving_average_hospital'
    );

    const value = formatNumber(
      data.hospital_admissions.last_value.moving_average_hospital
    );

    expect(normalizedText).toEqual(value);
  });
});
