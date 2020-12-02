import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
/// <reference types="cypress" />
import { National } from '../../../src/types/data';
import {
  formatNumber,
  formatPercentage,
} from '../../../src/utils/formatNumber';

context('Landelijk - Verpleeghuiszorg', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('national');
    cy.visit('/landelijk/verpleeghuiszorg');
  });

  it('Should show the correct KPI values', function (this: Context & {
    national: National;
  }) {
    const kpiTestInfo = {
      newly_infected_people: formatNumber(
        this.national.nursing_home.last_value.newly_infected_people
      ),
      infected_locations_total: [
        formatNumber(
          this.national.nursing_home.last_value.infected_locations_total
        ),
        `(${formatPercentage(
          this.national.nursing_home.last_value.infected_locations_percentage
        )}%)`,
      ],
      newly_infected_locations: formatNumber(
        this.national.nursing_home.last_value.newly_infected_locations
      ),
      deceased_daily: formatNumber(
        this.national.nursing_home.last_value.deceased_daily
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
