import { GmContext } from '~/integration/types';

context('Gemeente - Sterfte', () => {
  before(() => {
    cy.beforeGmTests('sterfte');
  });

  it('Should show the correct KPI values', function (this: GmContext) {
    const lastValue = this.municipalData.deceased_rivm_archived_20221231.last_value;

    const kpiTestInfo = {
      covid_daily: cy.formatters.formatNumber(lastValue.covid_daily),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
