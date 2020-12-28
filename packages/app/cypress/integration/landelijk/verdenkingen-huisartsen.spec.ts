import { NationalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Verdenkingen huisartsen', () => {
  before(() => {
    cy.beforeNationalTests('verdenkingen-huisartsen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.verdenkingen_huisartsen.last_value;

    const kpiTestInfo = {
      geschat_aantal: formatNumber(lastValue.geschat_aantal),
      incidentie: formatNumber(lastValue.incidentie),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
