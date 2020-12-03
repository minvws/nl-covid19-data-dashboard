import { NationalContext } from 'cypress/integration/types';
import { beforeNationalTests } from 'cypress/support/beforeNationalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Landelijk - IC Opnames', () => {
  swallowResizeObserverError();

  before(() => {
    beforeNationalTests('intensive-care-opnames');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const icBedsLastValue = this.nationalData.intensive_care_beds_occupied
      .last_value;

    const kpiTestInfo = {
      covid_occupied: [
        formatNumber(icBedsLastValue.covid_occupied),
        `(${formatPercentage(
          icBedsLastValue.covid_percentage_of_all_occupied
        )}%)`,
      ],
    };

    checkKpiValues(kpiTestInfo);
  });
});
