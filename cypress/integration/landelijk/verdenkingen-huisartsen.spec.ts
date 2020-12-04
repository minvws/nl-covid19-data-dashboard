import { NationalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Verdenkingen huisartsen', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('nationalData');
    cy.visit('/landelijk/verdenkingen-huisartsen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const kpiTestInfo = {
      geschat_aantal: formatNumber(
        this.nationalData.verdenkingen_huisartsen.last_value.geschat_aantal
      ),
      incidentie: formatNumber(
        this.nationalData.verdenkingen_huisartsen.last_value.incidentie
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
