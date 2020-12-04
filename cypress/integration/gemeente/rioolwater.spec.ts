import { MunicipalContext } from 'cypress/integration/types';
import { beforeMunicipalTests } from 'cypress/support/beforeMunicipalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Rioolwater', () => {
  swallowResizeObserverError();

  before(() => {
    beforeMunicipalTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.sewer?.last_value;

    const kpiTestInfo = {
      barscale_value: formatNumber(lastValue?.average),
      total_installation_count: formatNumber(
        lastValue?.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
