import { MunicipalContext } from 'cypress/integration/types';
import { beforeMunicipalTests } from 'cypress/support/beforeMunicipalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Rioolwater', () => {
  swallowResizeObserverError();

  before(() => {
    beforeMunicipalTests('rioolwater');
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const kpiTestInfo = {
      barscale_value: formatNumber(
        this.municipalData.sewer?.last_value.average
      ),
      total_installation_count: formatNumber(
        this.municipalData.sewer?.last_value.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
