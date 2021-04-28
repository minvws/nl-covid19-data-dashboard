import { MunicipalContext } from '~/integration/types';

context('Gemeente - Positief geteste mensen', () => {
  before(() => {
    cy.beforeMunicipalTests('positief-geteste-mensen');
  });

  // @ts-ignore
  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.tested_overall.last_value;

    const kpiTestInfo = {
      infected_per_100k: cy.formatters.formatNumber(
        lastValue.infected_per_100k
      ),
      infected: cy.formatters.formatNumber(lastValue.infected),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
