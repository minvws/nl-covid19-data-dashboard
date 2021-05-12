import { RegionalContext } from '~/integration/types';

context('Regionaal - Positief geteste mensen', () => {
  before(() => {
    cy.beforeRegionTests('positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const lastValue = this.regionData.tested_overall.last_value;

    const kpiTestInfo = {
      infected: cy.formatters.formatNumber(lastValue.infected),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
