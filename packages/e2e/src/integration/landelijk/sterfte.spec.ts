import { NationalContext } from '~/integration/types';

context('Landelijk - Sterfte', () => {
  before(() => {
    cy.beforeNationalTests('sterfte');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const rivmLastValue = this.nationalData.deceased_rivm.last_value;

    const kpiTestInfo = {
      covid_daily: cy.formatters.formatNumber(rivmLastValue.covid_daily),
      covid_total: cy.formatters.formatNumber(rivmLastValue.covid_total),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
