import { NationalContext } from 'cypress/integration/types';
import { beforeNationalTests } from 'cypress/support/beforeNationalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Landelijk - Gehandicaptenzorg', () => {
  swallowResizeObserverError();

  before(() => {
    beforeNationalTests('gehandicaptenzorg');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.disability_care.last_value;

    const kpiTestInfo = {
      newly_infected_people: formatNumber(lastValue.newly_infected_people),
      infected_locations_total: [
        formatNumber(lastValue.infected_locations_total),
        `${formatPercentage(lastValue.infected_locations_percentage)}%`,
      ],
      newly_infected_locations: formatNumber(
        lastValue.newly_infected_locations
      ),
      deceased_daily: formatNumber(lastValue.deceased_daily),
    };

    checkKpiValues(kpiTestInfo);
  });
});
