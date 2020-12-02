import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
/// <reference types="cypress" />
import { National } from '../../../src/types/data';
import { formatNumber } from '../../../src/utils/formatNumber';

context('Landelijk - Verdenkingen huisartsen', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('national');
    cy.visit('/landelijk/verdenkingen-huisartsen');
  });

  it('Should show the correct KPI values', function (this: Context & {
    national: National;
  }) {
    const kpiTestInfo = {
      geschat_aantal: formatNumber(
        this.national.verdenkingen_huisartsen.last_value.geschat_aantal
      ),
      incidentie: formatNumber(
        this.national.verdenkingen_huisartsen.last_value.incidentie
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
