import { RegionalContext } from '~/integration/types';

context('Regionaal - Rioolwater', () => {
  before(() => {
    cy.beforeRegionTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const lastValue = this.regionData.sewer.last_value;

    const kpiTestInfo = {
      riool_normalized: cy.formatters.formatNumber(lastValue.average),
      total_installation_count: cy.formatters.formatNumber(
        lastValue.total_installation_count
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
