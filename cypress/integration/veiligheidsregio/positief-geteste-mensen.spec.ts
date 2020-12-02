import { RegionalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Positief geteste mensen', () => {
  swallowResizeObserverError();

  const vrcode = 'VR13';

  before(() => {
    cy.fixture<Regionaal>(`${vrcode}.json`).as('regionData');
    cy.visit(`/veiligheidsregio/${vrcode}/positief-geteste-mensen`);
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const kpiTestInfo = {
      total_reported_increase_per_region: formatNumber(
        this.regionData.results_per_region.last_value
          .total_reported_increase_per_region
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
