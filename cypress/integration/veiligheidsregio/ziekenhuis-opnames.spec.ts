import { RegionalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Ziekenhuis opnames', () => {
  swallowResizeObserverError();

  const vrcode = 'VR13';

  before(() => {
    cy.fixture<Regionaal>(`${vrcode}.json`).as('regionData');
    cy.visit(`/veiligheidsregio/${vrcode}/ziekenhuis-opnames`);
  });

  xit('Should show the correct KPI values', async function (this: RegionalContext) {
    const kpiTestInfo = {
      hospital_moving_avg_per_region: formatNumber(
        this.regionData.results_per_region.last_value
          .hospital_moving_avg_per_region
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
