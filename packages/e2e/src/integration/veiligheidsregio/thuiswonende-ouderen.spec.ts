import { RegionalContext } from '~/integration/types';

context('Regionaal - Thuiswonende ouderen', () => {
  before(() => {
    cy.beforeRegionTests('thuiswonende-ouderen');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const lastValue = this.regionData.elderly_at_home_archived_20230126.last_value;

    const kpiTestInfo = {
      positive_tested_daily: cy.formatters.formatNumber(lastValue.positive_tested_daily),
      positive_tested_daily_per_100k: cy.formatters.formatNumber(lastValue.positive_tested_daily_per_100k),
      deceased_daily: cy.formatters.formatNumber(lastValue.deceased_daily),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
