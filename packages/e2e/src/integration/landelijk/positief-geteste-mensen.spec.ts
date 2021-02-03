import { NationalContext } from '~/integration/types';
import {
  formatNumber,
  formatPercentage,
  getLastFilledValue,
} from '@corona-dashboard/common';

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

  it('Should navigate to the appropriate municipality page after clicking on the choropleth', function (this: NationalContext) {
    cy.beforeNationalTests('positief-geteste-mensen');

    const testMunicipalCode = 'GM1970';

    const aPath = cy.get(
      `[data-cy=choropleths] path[data-id=${testMunicipalCode}]`
    );

    aPath.click({ force: true }).then(() => {
      cy.location().should((newLocation) => {
        expect(newLocation.pathname).to.eq(
          `/gemeente/${testMunicipalCode}/positief-geteste-mensen`
        );
      });
    });
  });

  it('Should select the correct choropleth navigate to the appropriate region page after clicking on the choropleth', function (this: NationalContext) {
    cy.beforeNationalTests('positief-geteste-mensen');

    const testVRCode = 'VR02';

    const regionButton = cy.get('[data-cy=radiogroup] [value=region]');

    regionButton.click({ force: true });

    const aPath = cy.get(`[data-cy=choropleths] path[data-id=${testVRCode}]`);

    aPath.click({ force: true }).then(() => {
      cy.location().should((newLocation) => {
        expect(newLocation.pathname).to.eq(
          `/veiligheidsregio/${testVRCode}/positief-geteste-mensen`
        );
      });
    });
  });
});
