import React from 'react';
import SewerWater from '~/pages/gemeente/[code]/rioolwater';
import { getTextByDataCy } from '~/test-utils/get-text-by-data-cy';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Municipal page: SewerWater', () => {
  const data = loadFixture<Municipal>('GM0363.json');

  it('should use average for sewerwater chart kpi value when multiple installations are present', () => {
    const { container } = render(
      <SewerWater
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );

    const normalizedText = getTextByDataCy(container, 'barscale_value');

    const value = formatNumber(data.sewer?.last_value.average);

    expect(normalizedText).toEqual(value);
  });

  it('should use rna_normalized for sewerwater chart kpi value when one installation is present', () => {
    const dataCopy: Municipal = JSON.parse(JSON.stringify(data));

    if (!dataCopy.sewer_per_installation) {
      dataCopy.sewer_per_installation = {
        values: [
          {
            rwzi_awzi_code: '31005',
            values: [
              {
                date_measurement_unix: 1600732800,
                week_start_unix: 1600646400,
                week_end_unix: 1601164800,
                week: 39,
                rwzi_awzi_code: '31005',
                rwzi_awzi_name: 'Westpoort',
                gmcode: 'GM0363',
                rna_normalized: 212.59,
                date_of_insertion_unix: 1605169572,
              },
            ],
            last_value: {
              date_measurement_unix: 1600732800,
              week_start_unix: 1600646400,
              week_end_unix: 1601164800,
              week: 39,
              rwzi_awzi_code: '31005',
              rwzi_awzi_name: 'Westpoort',
              gmcode: 'GM0363',
              rna_normalized: 212.59,
              date_of_insertion_unix: 1605169572,
            },
          },
        ],
      };
    } else {
      const firstInstallation = dataCopy.sewer_per_installation?.values[0];
      dataCopy.sewer_per_installation.values = [firstInstallation];
    }

    const { container } = render(
      <SewerWater
        data={dataCopy}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );

    const normalizedText = getTextByDataCy(container, 'barscale_value');

    const value = formatNumber(
      dataCopy.sewer_per_installation.values[0].last_value.rna_normalized
    );

    expect(normalizedText).toEqual(value);
  });

  it('should use total_installation_count for total installation count', () => {
    const { container } = render(
      <SewerWater
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );

    const normalizedText = getTextByDataCy(
      container,
      'total_installation_count'
    );

    const value = formatNumber(data.sewer?.last_value.total_installation_count);

    expect(normalizedText).toEqual(value);
  });
});
