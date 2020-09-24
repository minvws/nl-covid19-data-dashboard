import { Context } from 'mocha';
/// <reference types="cypress" />

import { National } from '../../src/types/data';
import { formatNumber } from '../../src/utils/formatNumber';

context('Landelijk - Positief geteste mensen', () => {
  beforeEach(() => {
    cy.fixture<National>('NL.json').as('national');
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

  it('Should show the correct average infected people', function (this: Context & {
    national: National;
  }) {
    const testValue = formatNumber(
      this.national.infected_people_delta_normalized.last_value
        .infected_daily_increase
    );

    cy.get('[data-cy=infected_daily_increase] text').contains(testValue);
  });
});
