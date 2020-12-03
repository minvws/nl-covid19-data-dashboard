import { RegionalContext } from 'cypress/integration/types';
import { beforeRegionTests } from 'cypress/support/beforeRegionTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Rioolwater', () => {
  swallowResizeObserverError();

  before(() => {
    beforeRegionTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const kpiTestInfo = {
      riool_normalized: formatNumber(this.regionData.sewer.last_value.average),
      total_installation_count: formatNumber(
        this.regionData.sewer.last_value.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
