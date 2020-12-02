import { Context } from 'mocha';
/// <reference types="cypress" />
import { National } from '../../src/types/data';
import { formatNumber, formatPercentage } from '../../src/utils/formatNumber';

context('Landelijk - Positief geteste mensen', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // For some reason this error throws very often during cypress tests,
    // it doesn't crash anything, so for now we're just going to swallow
    // the error and continue testing...
    const errorMessage = err.toString();
    if (errorMessage.indexOf('ResizeObserver loop') > -1) {
      return false;
    }
    return true;
  });

  before(() => {
    cy.fixture<National>('NL.json').as('national');
    cy.visit('/landelijk/positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: Context & {
    national: National;
  }) {
    const kpiValues = {
      infected_daily_total: formatNumber(
        this.national.infected_people_total.last_value.infected_daily_total
      ),
      ggd_infected: [
        formatNumber(this.national.ggd.last_value.infected),
        formatPercentage(this.national.ggd.last_value.infected_percentage),
      ],
      ggd_tested_total: formatNumber(this.national.ggd.last_value.tested_total),
    };

    Object.entries(kpiValues).forEach(([key, value]) => {
      const element = cy.get(`[data-cy=${key}]`);
      if (Array.isArray(value)) {
        value.forEach((val) => {
          element.contains(val);
        });
      } else {
        element.contains(value);
      }
    });
  });

  /*it('Should navigate to the appropriate municipality page after clicking on the choropleth', function (this: Context & {
    national: National;
  }) {
    const testMunicipalCode = 'GM0003';

    const aPath = cy.get(
      `[data-cy=choropleths] [data-cy=choropleth-hovers] path[data-id=${testMunicipalCode}]`
    );

    aPath.click().then(() => {
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(
          `/gemeente/${testMunicipalCode}/positief-geteste-mensen`
        );
      });
    });
  });*/
});
