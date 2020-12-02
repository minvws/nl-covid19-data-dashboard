import { RegionalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Regionaal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Regionaal - Rioolwater', () => {
  swallowResizeObserverError();

  const vrcode = 'VR13';

  before(() => {
    cy.fixture<Regionaal>(`${vrcode}.json`).as('regionData');
    cy.visit(`/veiligheidsregio/${vrcode}/rioolwater`);
  });

  it('Should show the correct KPI values', function (this: RegionalContext) {
    const kpiTestInfo = {
      riool_normalized: formatNumber(this.regionData.sewer.last_value.average),
      total_installation_count: formatNumber(
        this.regionData.sewer.last_value.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
