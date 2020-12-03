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
    const nursingHomeLastValue = this.regionData.nursing_home.last_value;

    const kpiTestInfo = {
      newly_infected_people: formatNumber(
        nursingHomeLastValue.newly_infected_people
      ),
      infected_locations_total: [
        formatNumber(nursingHomeLastValue.infected_locations_total),
        `${formatPercentage(
          nursingHomeLastValue.infected_locations_percentage
        )}%`,
      ],
      newly_infected_locations: formatNumber(
        nursingHomeLastValue.newly_infected_locations
      ),
      deceased_daily: formatNumber(nursingHomeLastValue.deceased_daily),
    };

    checkKpiValues(kpiTestInfo);
  });
});
