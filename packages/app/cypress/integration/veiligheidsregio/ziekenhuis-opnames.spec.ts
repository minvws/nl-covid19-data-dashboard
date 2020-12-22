import { RegionalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeRegionTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', async function (this: RegionalContext) {
    const lastValue = this.regionData.results_per_region.last_value;

    const kpiTestInfo = {
      hospital_moving_avg_per_region: formatNumber(
        lastValue.hospital_moving_avg_per_region
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
