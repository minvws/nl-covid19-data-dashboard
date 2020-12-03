import { NationalContext } from 'cypress/integration/types';
import { beforeNationalTests } from 'cypress/support/beforeNationalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Landelijk - Verpleeghuiszorg', () => {
  swallowResizeObserverError();

  before(() => {
    beforeNationalTests('verpleeghuiszorg');
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
