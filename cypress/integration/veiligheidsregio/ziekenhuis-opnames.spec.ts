import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
/// <reference types="cypress" />
import { Regionaal } from '../../../src/types/data';
import { formatNumber } from '../../../src/utils/formatNumber';

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
