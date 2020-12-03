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
    const sewerLastValue = this.municipalData.sewer?.last_value;

    const kpiTestInfo = {
      barscale_value: formatNumber(sewerLastValue?.average),
      total_installation_count: formatNumber(
        sewerLastValue?.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
