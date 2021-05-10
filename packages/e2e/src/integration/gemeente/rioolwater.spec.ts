import { MunicipalContext } from '~/integration/types';

context('Gemeente - Rioolwater', () => {
  before(() => {
    cy.beforeMunicipalTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
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
