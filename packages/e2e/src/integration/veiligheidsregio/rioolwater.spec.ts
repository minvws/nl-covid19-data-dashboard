import { RegionalContext } from '~/integration/types';
import { formatNumber } from '@corona-dashboard/common';

context('Regionaal - Rioolwater', () => {
  before(() => {
    cy.beforeRegionTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const lastValue = this.regionData.sewer.last_value;

    const kpiTestInfo = {
      riool_normalized: formatNumber(lastValue.average),
      total_installation_count: formatNumber(
        lastValue.total_installation_count
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
