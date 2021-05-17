import { NationalContext } from '~/integration/types';

context('Landelijk - Thuiswonende ouderen', () => {
  before(() => {
    cy.beforeNationalTests('thuiswonende-ouderen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.elderly_at_home.last_value;

    const kpiTestInfo = {
      positive_tested_daily: cy.formatters.formatNumber(
        lastValue.positive_tested_daily
      ),
      positive_tested_daily_per_100k: cy.formatters.formatNumber(
        lastValue.positive_tested_daily_per_100k
      ),
      deceased_daily: cy.formatters.formatNumber(lastValue.deceased_daily),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
