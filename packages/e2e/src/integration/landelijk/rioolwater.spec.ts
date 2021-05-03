import { NationalContext } from '~/integration/types';

context('Landelijk - Rioolwater', () => {
  before(() => {
    cy.beforeNationalTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.sewer.last_value;

    const kpiTestInfo = {
      sewer_average: cy.formatters.formatNumber(lastValue.average),
      total_installation_count: cy.formatters.formatNumber(
        lastValue.total_installation_count
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
