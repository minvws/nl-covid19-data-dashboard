import { RegionalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeRegionTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', async function (this: RegionalContext) {
    const lastValue = this.regionData.hospital.last_value;

    const kpiTestInfo = {
      admissions_moving_average: formatNumber(
        lastValue.admissions_moving_average
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
