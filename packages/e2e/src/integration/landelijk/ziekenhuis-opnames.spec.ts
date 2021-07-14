import { NlContext } from '~/integration/types';

context('Landelijk - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeNlTests('ziekenhuis-opnames');
  });

  it('Should show the correct KPI values', function (this: NlContext) {
    const lastValue = this.nationalData.hospital_lcps.last_value;

    const kpiTestInfo = {
      beds_occupied_covid: cy.formatters.formatNumber(
        lastValue.beds_occupied_covid
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
