import { NationalContext } from 'cypress/integration/types';
import { beforeNationalTests } from 'cypress/support/beforeNationalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Ziekenhuis opnames', () => {
  swallowResizeObserverError();

  before(() => {
    beforeNationalTests('ziekenhuis-opnames');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.hospital_beds_occupied.last_value;

    const kpiTestInfo = {
      covid_occupied: formatNumber(lastValue.covid_occupied),
    };

    checkKpiValues(kpiTestInfo);
  });
});
