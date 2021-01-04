import { NationalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';
import { getLastFilledValue } from '~/utils/get-last-filled-value';

context('Landelijk - Besmettelijke mensen', () => {
  before(() => {
    cy.beforeNationalTests('besmettelijke-mensen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = getLastFilledValue(this.nationalData.infectious_people);

    const kpiTestInfo = {
      estimate: formatNumber(lastValue.estimate),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
