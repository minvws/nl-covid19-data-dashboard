import { NationalContext } from 'cypress/integration/types';
import { beforeNationalTests } from 'cypress/support/beforeNationalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Rioolwater', () => {
  swallowResizeObserverError();

  before(() => {
    beforeNationalTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.sewer.last_value;

    const kpiTestInfo = {
      sewer_average: formatNumber(lastValue.average),
      total_installation_count: formatNumber(
        lastValue.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
