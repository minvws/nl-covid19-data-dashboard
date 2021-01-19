import { NationalContext } from '~/integration/types';
import { formatNumber } from '@corona-dashboard/common';

context('Landelijk - Thuiswonende ouderen', () => {
  before(() => {
    cy.beforeNationalTests('thuiswonende-ouderen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.elderly_at_home.last_value;

    const kpiTestInfo = {
      positive_tested_daily: formatNumber(lastValue.positive_tested_daily),
      positive_tested_daily_per_100k: formatNumber(
        lastValue.positive_tested_daily_per_100k
      ),
      deceased_daily: formatNumber(lastValue.deceased_daily),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
