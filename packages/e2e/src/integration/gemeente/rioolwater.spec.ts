import { GmContext } from '~/integration/types';

context('Gemeente - Rioolwater', () => {
  before(() => {
    cy.beforeGmTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: GmContext) {
    const lastValue = this.municipalData.sewer?.last_value;

    const kpiTestInfo = {
      average: cy.formatters.formatNumber(lastValue?.average),
      total_number_of_samples: cy.formatters.formatNumber(
        lastValue?.total_number_of_samples
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
