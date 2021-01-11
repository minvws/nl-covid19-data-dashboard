import { NationalContext } from 'cypress/integration/types';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { getLastFilledValue } from '~/utils/get-last-filled-value';

context('Landelijk - Positief geteste mensen', () => {
  before(() => {
    cy.beforeNationalTests('positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const infectedTotalLastValue = getLastFilledValue(
      this.nationalData.tested_overall
    );
    const ggdLastValue = getLastFilledValue(
      this.nationalData.tested_ggd_average
    );

    const kpiTestInfo = {
      infected: formatNumber(infectedTotalLastValue.infected),
      ggd_infected: formatPercentage(ggdLastValue.infected_percentage),
      ggd_tested_total: formatNumber(ggdLastValue.tested_total),
    };

    cy.checkKpiValues(kpiTestInfo);
  });

  xit('Should navigate to the appropriate municipality page after clicking on the choropleth', function (this: NationalContext) {
    const testMunicipalCode = 'GM0003';

    const aPath = cy.get(
      `[data-cy=choropleths] [data-cy=choropleth-hovers] path[data-id=${testMunicipalCode}]`
    );

    aPath.click().then(() => {
      cy.location().should((loc) => {
        expect(loc.pathname).to.eq(
          `/gemeente/${testMunicipalCode}/positief-geteste-mensen`
        );
      });
    });
  });
});
