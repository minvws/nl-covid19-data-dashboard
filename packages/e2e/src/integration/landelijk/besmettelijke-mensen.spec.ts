import { getLastFilledValue } from '@corona-dashboard/common';
import { NlContext } from '~/integration/types';

context('Landelijk - Besmettelijke mensen', () => {
  before(() => {
    cy.beforeNlTests('besmettelijke-mensen');
  });

  it('Should show the correct KPI values', function (this: NlContext) {
    const lastValue = getLastFilledValue(this.nationalData.infectious_people);

    const kpiTestInfo = {
      estimate: cy.formatters.formatNumber(lastValue.estimate),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
