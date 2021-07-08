import { NlContext } from '~/integration/types';

context('Landelijk - Rioolwater', () => {
  before(() => {
    cy.beforeNlTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: NlContext) {
    const lastValue = this.nationalData.sewer.last_value;

    const kpiTestInfo = {
      average: cy.formatters.formatNumber(lastValue.average),
      total_number_of_samples: cy.formatters.formatNumber(
        lastValue.total_number_of_samples
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
