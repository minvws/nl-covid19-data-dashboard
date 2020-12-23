import { NationalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeNationalTests('ziekenhuis-opnames');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.hospital_beds_occupied.last_value;

    const kpiTestInfo = {
      covid_occupied: formatNumber(lastValue.covid_occupied),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
