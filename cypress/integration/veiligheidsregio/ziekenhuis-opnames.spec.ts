import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Ziekenhuis opnames', () => {
  swallowResizeObserverError();

  const vrcode = 'VR13';

  before(() => {
    cy.fixture<Regionaal>(`${vrcode}.json`).as('region');
    cy.visit(`/veiligheidsregio/${vrcode}/ziekenhuis-opnames`);
  });

  xit('Should show the correct KPI values', function (this: Context & {
    region: Regionaal;
  }) {
    const kpiTestInfo = {
      hospital_moving_avg_per_region: formatNumber(
        this.region.results_per_region.last_value.hospital_moving_avg_per_region
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
