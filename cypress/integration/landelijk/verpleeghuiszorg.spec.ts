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
    const nursingHomeLastValue = this.nationalData.nursing_home.last_value;

    const kpiTestInfo = {
      newly_infected_people: formatNumber(
        nursingHomeLastValue.newly_infected_people
      ),
      infected_locations_total: [
        formatNumber(nursingHomeLastValue.infected_locations_total),
        `(${formatPercentage(
          nursingHomeLastValue.infected_locations_percentage
        )}%)`,
      ],
      newly_infected_locations: formatNumber(
        nursingHomeLastValue.newly_infected_locations
      ),
      deceased_daily: formatNumber(nursingHomeLastValue.deceased_daily),
    };

    checkKpiValues(kpiTestInfo);
  });
});
