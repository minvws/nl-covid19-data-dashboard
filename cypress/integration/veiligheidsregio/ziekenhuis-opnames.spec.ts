import { RegionalContext } from 'cypress/integration/types';
import { beforeRegionTests } from 'cypress/support/beforeRegionTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Ziekenhuis opnames', () => {
  swallowResizeObserverError();

  before(() => {
    beforeRegionTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', async function (this: RegionalContext) {
    const resultsPerRegionLastValue = this.regionData.results_per_region
      .last_value;

    const kpiTestInfo = {
      hospital_moving_avg_per_region: formatNumber(
        resultsPerRegionLastValue.hospital_moving_avg_per_region
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
