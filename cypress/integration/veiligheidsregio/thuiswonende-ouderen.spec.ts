import { RegionalContext } from 'cypress/integration/types';
import { beforeRegionTests } from 'cypress/support/beforeRegionTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Thuiswonende ouderen', () => {
  swallowResizeObserverError();

  before(() => {
    beforeRegionTests('thuiswonende-ouderen');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const lastValue = this.regionData.elderly_at_home.last_value;

    const kpiTestInfo = {
      positive_tested_daily: formatNumber(lastValue.positive_tested_daily),
      positive_tested_daily_per_100k: formatNumber(
        lastValue.positive_tested_daily_per_100k
      ),
      deceased_daily: formatNumber(lastValue.deceased_daily),
    };

    checkKpiValues(kpiTestInfo);
  });
});
