import React from 'react';
import SewerWater from '~/pages/gemeente/[code]/rioolwater';
import { loadFixture } from '~/test-utils/load-fixture';
import { render } from '~/test-utils/render';
import { testKpiValue } from '~/test-utils/test-kpi-value';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

describe('Municipal page: SewerWater', () => {
  const data = loadFixture<Municipal>('GM0363.json');
  let container: HTMLElement;

  beforeEach(() => {
    const renderResult = render(
      <SewerWater
        data={data}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );
    container = renderResult.container;
  });

  it('should use average for sewerwater chart kpi value when multiple installations are present', () => {
    testKpiValue(
      container,
      'barscale_value',
      formatNumber(data.sewer?.last_value.average)
    );
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

    const { container: localContainer } = render(
      <SewerWater
        data={dataCopy}
        lastGenerated="test"
        municipalityName="Test gemeente"
      />
    );

    testKpiValue(
      localContainer,
      'barscale_value',
      formatNumber(
        dataCopy.sewer_per_installation.values[0].last_value.rna_normalized
      )
    );
  });

  it('should use total_installation_count for total installation count', () => {
    testKpiValue(
      container,
      'total_installation_count',
      formatNumber(data.sewer?.last_value.total_installation_count)
    );
  });
});
