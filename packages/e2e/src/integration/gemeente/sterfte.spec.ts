import { MunicipalContext } from '~/integration/types';

context('Gemeente - Sterfte', () => {
  before(() => {
    cy.beforeMunicipalTests('sterfte');
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.deceased_rivm.last_value;

    const kpiTestInfo = {
      covid_daily: cy.formatters.formatNumber(lastValue.covid_daily),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
