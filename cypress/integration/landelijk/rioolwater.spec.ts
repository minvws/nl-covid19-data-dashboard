import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
/// <reference types="cypress" />
import { National } from '../../../src/types/data';
import { formatNumber } from '../../../src/utils/formatNumber';

context('Landelijk - Rioolwater', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('national');
    cy.visit('/landelijk/rioolwater');
  });

  it('Should show the correct KPI values', function (this: Context & {
    national: National;
  }) {
    const kpiTestInfo = {
      sewer_average: formatNumber(this.national.sewer.last_value.average),
      total_installation_count: formatNumber(
        this.national.sewer.last_value.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
