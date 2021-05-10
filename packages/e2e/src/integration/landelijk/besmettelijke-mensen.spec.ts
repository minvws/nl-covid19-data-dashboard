import { getLastFilledValue } from '@corona-dashboard/common';
import { NationalContext } from '~/integration/types';

context('Landelijk - Besmettelijke mensen', () => {
  before(() => {
    cy.beforeNationalTests('besmettelijke-mensen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = getLastFilledValue(this.nationalData.infectious_people);

    const kpiTestInfo = {
      estimate: cy.formatters.formatNumber(lastValue.estimate),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
