import { NlContext } from '~/integration/types';

context('Landelijk - Thuiswonende ouderen', () => {
  before(() => {
    cy.beforeNlTests('thuiswonende-ouderen');
  });

  it('Should show the correct KPI values', function (this: NlContext) {
    const lastValue = this.nationalData.elderly_at_home_archived_20230126.last_value;

    const kpiTestInfo = {
      positive_tested_daily: cy.formatters.formatNumber(lastValue.positive_tested_daily),
      positive_tested_daily_per_100k: cy.formatters.formatNumber(lastValue.positive_tested_daily_per_100k),
      deceased_daily: cy.formatters.formatNumber(lastValue.deceased_daily),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
