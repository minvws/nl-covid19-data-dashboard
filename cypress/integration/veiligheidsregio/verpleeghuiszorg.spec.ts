import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
/// <reference types="cypress" />
import { Regionaal } from '../../../src/types/data';
import {
  formatNumber,
  formatPercentage,
} from '../../../src/utils/formatNumber';

context('Regionaal - Verpleeghuiszorg', () => {
  swallowResizeObserverError();

  const vrcode = 'VR13';

  before(() => {
    cy.fixture<Regionaal>(`${vrcode}.json`).as('region');
    cy.visit(`/veiligheidsregio/${vrcode}/verpleeghuiszorg`);
  });

  it('Should show the correct KPI values', function (this: Context & {
    region: Regionaal;
  }) {
    const kpiTestInfo = {
      newly_infected_people: formatNumber(
        this.region.nursing_home.last_value.newly_infected_people
      ),
      infected_locations_total: [
        formatNumber(
          this.region.nursing_home.last_value.infected_locations_total
        ),
        `(${formatPercentage(
          this.region.nursing_home.last_value.infected_locations_percentage
        )}%)`,
      ],
      newly_infected_locations: formatNumber(
        this.region.nursing_home.last_value.newly_infected_locations
      ),
      deceased_daily: formatNumber(
        this.region.nursing_home.last_value.deceased_daily
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
