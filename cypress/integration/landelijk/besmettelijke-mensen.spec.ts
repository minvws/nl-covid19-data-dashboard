import { NationalContext } from 'cypress/integration/types';
import { beforeNationalTests } from 'cypress/support/beforeNationalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Besmettelijke mensen', () => {
  swallowResizeObserverError();

  before(() => {
    beforeNationalTests('besmettelijke-mensen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.infectious_people_last_known_average
      .last_value;

    const kpiTestInfo = {
      infectious_avg: formatNumber(lastValue.infectious_avg),
    };

    checkKpiValues(kpiTestInfo);
  });
});
