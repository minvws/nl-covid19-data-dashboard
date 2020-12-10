import { NationalContext } from 'cypress/integration/types';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Landelijk - IC Opnames', () => {
  before(() => {
    cy.beforeNationalTests('intensive-care-opnames');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.intensive_care_beds_occupied.last_value;

    const kpiTestInfo = {
      covid_occupied: [
        formatNumber(lastValue.covid_occupied),
        `(${formatPercentage(lastValue.covid_percentage_of_all_occupied)}%)`,
      ],
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
