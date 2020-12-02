import { NationalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Besmettelijke mensen', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('nationalData');
    cy.visit('/landelijk/besmettelijke-mensen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const kpiTestInfo = {
      infectious_avg: formatNumber(
        this.nationalData.infectious_people_last_known_average.last_value
          .infectious_avg
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
