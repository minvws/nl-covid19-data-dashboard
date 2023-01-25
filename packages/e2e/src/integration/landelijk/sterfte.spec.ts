import { NlContext } from '~/integration/types';

context('Landelijk - Sterfte', () => {
  before(() => {
    cy.beforeNlTests('sterfte');
  });

  it('Should show the correct KPI values', function (this: NlContext) {
    const rivmLastValue = this.nationalData.deceased_rivm_archived_20221231.last_value;

    const kpiTestInfo = {
      covid_daily: cy.formatters.formatNumber(rivmLastValue.covid_daily),
      covid_total: cy.formatters.formatNumber(rivmLastValue.covid_total),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
