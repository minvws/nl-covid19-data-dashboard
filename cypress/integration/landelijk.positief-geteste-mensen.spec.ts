import { Context } from 'mocha';
/// <reference types="cypress" />
/// <reference types="../../src/types/data" />

import { National } from '../../src/types/data';
import { formatNumber } from '../../src/utils/formatNumber';

context('Landelijk - Positief geteste mensen', () => {
  before(() => {
    cy.fixture<National>('NL.json').as('national');
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/landelijk/positief-geteste-mensen');
  });

  it('Should show the correct total infected people', function (this: Context & {
    national: National;
  }) {
    const testValue = formatNumber(
      this.national.infected_people_total.last_value.infected_daily_total
    );

    cy.get('[data-cy=infected_daily_total]').contains(testValue);
  });
});
