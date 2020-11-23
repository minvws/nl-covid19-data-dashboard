import React from 'react';
import SuspectedPatients from '~/pages/landelijk/verdenkingen-huisartsen';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('National page: SuspectedPatients', () => {
  const data = loadFixture<National>('NL.json');

  it('should use geschat_aantal for suspected patients estimation', () => {
    const { container } = render(
      <SuspectedPatients data={data} lastGenerated="test" text={{}} />
    );

    const estimatedText = getTextByDataCy(container, 'geschat_aantal');

    const value = formatNumber(
      data.verdenkingen_huisartsen.last_value.geschat_aantal
    );

    expect(estimatedText).toEqual(value);
  });

  it('should use incidentie for suspected patients normalized count', () => {
    const { container } = render(
      <SuspectedPatients data={data} lastGenerated="test" text={{}} />
    );

    const normalizedText = getTextByDataCy(container, 'incidentie');

    const value = formatNumber(
      data.verdenkingen_huisartsen.last_value.incidentie
    );

    expect(normalizedText).toEqual(value);
  });
});
