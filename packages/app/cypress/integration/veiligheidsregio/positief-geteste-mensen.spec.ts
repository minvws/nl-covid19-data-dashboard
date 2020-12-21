import { RegionalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Positief geteste mensen', () => {
  before(() => {
    cy.beforeRegionTests('positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const lastValue = this.regionData.results_per_region.last_value;

    const kpiTestInfo = {
      total_reported_increase_per_region: formatNumber(
        lastValue.total_reported_increase_per_region
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
