import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
import { National } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Landelijk - Positief geteste mensen', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('national');
    cy.visit('/landelijk/positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: Context & {
    national: National;
  }) {
    const kpiTestInfo = {
      infected_daily_total: formatNumber(
        this.national.infected_people_total.last_value.infected_daily_total
      ),
      ggd_infected: [
        formatNumber(this.national.ggd.last_value.infected),
        formatPercentage(this.national.ggd.last_value.infected_percentage),
      ],
      ggd_tested_total: formatNumber(this.national.ggd.last_value.tested_total),
    };

    checkKpiValues(kpiTestInfo);
  });

  xit('Should navigate to the appropriate municipality page after clicking on the choropleth', function (this: Context & {
    national: National;
  }) {
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
