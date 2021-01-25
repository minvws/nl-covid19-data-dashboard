import { MunicipalContext } from '~/integration/types';
import { formatNumber } from '@corona-dashboard/common';

context('Gemeente - Rioolwater', () => {
  before(() => {
    cy.beforeMunicipalTests('rioolwater');
  });

  // @ts-ignore
  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.sewer?.last_value;

    const kpiTestInfo = {
      barscale_value: formatNumber(lastValue?.average),
      total_installation_count: formatNumber(
        lastValue?.total_installation_count
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
