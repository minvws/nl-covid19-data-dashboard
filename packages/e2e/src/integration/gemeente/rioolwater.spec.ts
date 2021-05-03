import { MunicipalContext } from '~/integration/types';

context('Gemeente - Rioolwater', () => {
  before(() => {
    cy.beforeMunicipalTests('rioolwater');
  });

  // @ts-ignore
  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.sewer?.last_value;

    const kpiTestInfo = {
      barscale_value: cy.formatters.formatNumber(lastValue?.average),
      total_installation_count: cy.formatters.formatNumber(
        lastValue?.total_installation_count
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
