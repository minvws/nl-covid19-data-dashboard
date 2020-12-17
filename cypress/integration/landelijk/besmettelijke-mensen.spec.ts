import { NationalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Besmettelijke mensen', () => {
  before(() => {
    cy.beforeNationalTests('besmettelijke-mensen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.infectious_people_last_known_average
      .last_value;

    const kpiTestInfo = {
      infectious_avg: formatNumber(lastValue.infectious_avg),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
