import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { National } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';
import { NationalContext } from '../types';

context('Landelijk - Ziekenhuis opnames', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('nationalData');
    cy.visit('/landelijk/ziekenhuis-opnames');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const kpiTestInfo = {
      covid_occupied: formatNumber(
        this.nationalData.hospital_beds_occupied.last_value.covid_occupied
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
