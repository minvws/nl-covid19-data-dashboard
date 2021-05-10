import { RegionalContext } from '~/integration/types';

context('Regionaal - Rioolwater', () => {
  before(() => {
    cy.beforeRegionTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const lastValue = this.regionData.sewer.last_value;

    const kpiTestInfo = {
      average: cy.formatters.formatNumber(lastValue.average),
      total_number_of_samples: cy.formatters.formatNumber(
        lastValue.total_number_of_samples
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
