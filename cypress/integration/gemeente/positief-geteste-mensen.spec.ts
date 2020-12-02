import { MunicipalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Positief geteste mensen', () => {
  swallowResizeObserverError();

  const gmcode = 'GM0363';

  before(() => {
    cy.fixture<Municipal>(`${gmcode}.json`).as('municipalData');
    cy.visit(`/gemeente/${gmcode}/positief-geteste-mensen`);
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const kpiTestInfo = {
      infected_daily_increase: formatNumber(
        this.municipalData.positive_tested_people.last_value
          .infected_daily_increase
      ),
      infected_daily_total: formatNumber(
        this.municipalData.positive_tested_people.last_value
          .infected_daily_total
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
