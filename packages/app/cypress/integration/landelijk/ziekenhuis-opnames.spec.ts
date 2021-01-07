import { NationalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeNationalTests('ziekenhuis-opnames');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.hospital_lcps.last_value;

    const kpiTestInfo = {
      beds_occupied_covid: formatNumber(lastValue.beds_occupied_covid),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
