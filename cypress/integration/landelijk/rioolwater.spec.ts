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
    const kpiTestInfo = {
      sewer_average: formatNumber(this.nationalData.sewer.last_value.average),
      total_installation_count: formatNumber(
        this.nationalData.sewer.last_value.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
