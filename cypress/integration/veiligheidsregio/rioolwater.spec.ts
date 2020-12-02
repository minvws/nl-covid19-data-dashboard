import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
/// <reference types="cypress" />
import { Regionaal } from '../../../src/types/data';
import { formatNumber } from '../../../src/utils/formatNumber';

context('Regionaal - Rioolwater', () => {
  swallowResizeObserverError();

  const vrcode = 'VR13';

  before(() => {
    cy.fixture<Regionaal>(`${vrcode}.json`).as('region');
    cy.visit(`/veiligheidsregio/${vrcode}/rioolwater`);
  });

  it('Should show the correct KPI values', function (this: Context & {
    region: Regionaal;
  }) {
    const kpiTestInfo = {
      riool_normalized: formatNumber(this.region.sewer.last_value.average),
      total_installation_count: formatNumber(
        this.region.sewer.last_value.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
