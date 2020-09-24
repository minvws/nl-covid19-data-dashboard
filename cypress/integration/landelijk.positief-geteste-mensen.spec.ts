/// <reference types="cypress" />

import { National } from '~/types/data';

context('Landelijk - Positief geteste mensen', () => {
  before(() => {
    cy.fixture('NL.json').as('national') as National;
  });

  beforeEach(() => {
    cy.visit('http://localhost:3000/landelijk/positief-geteste-mensen');
  });

  it('Should show the correct total infected people', function (this: National) {
    const infected_daily_total = '1.093';
    cy.get('[data-cy=infected_daily_total]').contains(infected_daily_total);
  });
});
