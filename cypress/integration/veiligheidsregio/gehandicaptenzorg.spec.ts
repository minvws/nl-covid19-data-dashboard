import { RegionalContext } from 'cypress/integration/types';
import { beforeRegionTests } from 'cypress/support/beforeRegionTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Regionaal - Gehandicaptenzorg', () => {
  swallowResizeObserverError();

  before(() => {
    beforeRegionTests('gehandicaptenzorg');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const disablityCareLastValue = this.regionData.disability_care.last_value;

    const kpiTestInfo = {
      newly_infected_people: formatNumber(
        disablityCareLastValue.newly_infected_people
      ),
      infected_locations_total: [
        formatNumber(disablityCareLastValue.infected_locations_total),
        `${formatPercentage(
          disablityCareLastValue.infected_locations_percentage
        )}%`,
      ],
      newly_infected_locations: formatNumber(
        disablityCareLastValue.newly_infected_locations
      ),
      deceased_daily: formatNumber(disablityCareLastValue.deceased_daily),
    };

    checkKpiValues(kpiTestInfo);
  });
});
