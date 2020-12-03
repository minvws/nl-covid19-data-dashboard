import { RegionalContext } from 'cypress/integration/types';
import { beforeRegionTests } from 'cypress/support/beforeRegionTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Regionaal - Verpleeghuiszorg', () => {
  swallowResizeObserverError();

  before(() => {
    beforeRegionTests('verpleeghuiszorg');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const kpiTestInfo = {
      newly_infected_people: formatNumber(
        this.regionData.nursing_home.last_value.newly_infected_people
      ),
      infected_locations_total: [
        formatNumber(
          this.regionData.nursing_home.last_value.infected_locations_total
        ),
        `(${formatPercentage(
          this.regionData.nursing_home.last_value.infected_locations_percentage
        )}%)`,
      ],
      newly_infected_locations: formatNumber(
        this.regionData.nursing_home.last_value.newly_infected_locations
      ),
      deceased_daily: formatNumber(
        this.regionData.nursing_home.last_value.deceased_daily
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
