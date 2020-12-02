import { NationalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { National } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Landelijk - Verpleeghuiszorg', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('nationalData');
    cy.visit('/landelijk/verpleeghuiszorg');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const kpiTestInfo = {
      newly_infected_people: formatNumber(
        this.nationalData.nursing_home.last_value.newly_infected_people
      ),
      infected_locations_total: [
        formatNumber(
          this.nationalData.nursing_home.last_value.infected_locations_total
        ),
        `(${formatPercentage(
          this.nationalData.nursing_home.last_value
            .infected_locations_percentage
        )}%)`,
      ],
      newly_infected_locations: formatNumber(
        this.nationalData.nursing_home.last_value.newly_infected_locations
      ),
      deceased_daily: formatNumber(
        this.nationalData.nursing_home.last_value.deceased_daily
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
