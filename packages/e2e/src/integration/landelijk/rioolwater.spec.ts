import { NationalContext } from '~/integration/types';
import { formatNumber } from '@corona-dashboard/common';

context('Landelijk - Rioolwater', () => {
  before(() => {
    cy.beforeNationalTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.sewer.last_value;

    const kpiTestInfo = {
      sewer_average: formatNumber(lastValue.average),
      total_installation_count: formatNumber(
        lastValue.total_installation_count
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
