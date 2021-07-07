import { NlContext } from '~/integration/types';

context('Landelijk - IC Opnames', () => {
  before(() => {
    cy.beforeNlTests('intensive-care-opnames');
  });

  it('Should show the correct KPI values', function (this: NlContext) {
    const lastValue = this.nationalData.intensive_care_lcps.last_value;

    const kpiTestInfo = {
      beds_occupied_covid: [
        cy.formatters.formatNumber(lastValue.beds_occupied_covid),
        `(${cy.formatters.formatPercentage(
          lastValue.beds_occupied_covid_percentage
        )}%)`,
      ],
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
