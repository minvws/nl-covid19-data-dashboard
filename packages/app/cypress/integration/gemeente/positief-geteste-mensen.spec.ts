import { MunicipalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Positief geteste mensen', () => {
  before(() => {
    cy.beforeMunicipalTests('positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.tested_overall.last_value;

    const kpiTestInfo = {
      infected_per_100k: formatNumber(lastValue.infected_per_100k),
      infected: formatNumber(lastValue.infected),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
