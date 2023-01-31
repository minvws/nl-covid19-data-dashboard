import { RegionalContext } from '~/integration/types';

context('Regionaal - Sterfte', () => {
  before(() => {
    cy.beforeRegionTests('sterfte');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const rivmLastValue = this.regionData.deceased_rivm_archived_20221231.last_value;

    const kpiTestInfo = {
      covid_daily: cy.formatters.formatNumber(rivmLastValue.covid_daily),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
