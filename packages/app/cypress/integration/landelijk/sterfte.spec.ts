import { NationalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Sterfte', () => {
  before(() => {
    cy.beforeNationalTests('sterfte');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const rivmLastValue = this.nationalData.deceased_rivm.last_value;

    const kpiTestInfo = {
      covid_daily: formatNumber(rivmLastValue.covid_daily),
      covid_total: formatNumber(rivmLastValue.covid_total),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
