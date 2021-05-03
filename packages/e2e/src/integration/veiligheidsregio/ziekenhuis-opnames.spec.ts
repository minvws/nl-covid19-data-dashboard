import { RegionalContext } from '~/integration/types';

context('Regionaal - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeRegionTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', async function (this: RegionalContext) {
    const lastValue = this.regionData.hospital_nice.last_value;

    const kpiTestInfo = {
      admissions_on_date_of_reporting: cy.formatters.formatNumber(
        lastValue.admissions_on_date_of_reporting
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
