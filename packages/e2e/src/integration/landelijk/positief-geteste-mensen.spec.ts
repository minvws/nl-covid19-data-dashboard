import { getLastFilledValue } from '@corona-dashboard/common';
import { NlContext } from '~/integration/types';

context('Landelijk - Positief geteste mensen', () => {
  before(() => {
    cy.beforeNlTests('positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: NlContext) {
    const infectedTotalLastValue = getLastFilledValue(
      this.nationalData.tested_overall
    );
    const ggdLastValue = getLastFilledValue(this.nationalData.tested_ggd);

    const kpiTestInfo = {
      infected_moving_average: cy.formatters.formatNumber(
        infectedTotalLastValue.infected_moving_average
      ),
      infected_percentage_moving_average: cy.formatters.formatPercentage(
        ggdLastValue.infected_percentage_moving_average
      ),
      tested_total_moving_average: cy.formatters.formatNumber(
        ggdLastValue.tested_total_moving_average
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });

  it('Should navigate to the appropriate municipality page after clicking on the choropleth', function (this: NlContext) {
    cy.beforeNlTests('positief-geteste-mensen');

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

  it('Should select the correct choropleth navigate to the appropriate region page after clicking on the choropleth', function (this: NlContext) {
    cy.beforeNlTests('positief-geteste-mensen');

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
