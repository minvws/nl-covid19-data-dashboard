import { Context } from 'mocha';
import { runInContext } from 'node_modules/cypress/types/lodash/index';
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

  it('Should navigate to the appropriate municipality page after clicking on the chloropleth', function (this: Context & {
    national: National;
  }) {
    const testMunicipalCode = 'GM0003';

    const aPath = cy.get(
      `[data-cy=chloropleths] [data-cy=choropleth-hovers] path[data-id=${testMunicipalCode}]`
    );

    aPath.click().then(() => {
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(
          `/gemeente/${testMunicipalCode}/positief-geteste-mensen`
        );
      });
    });
  });
});
