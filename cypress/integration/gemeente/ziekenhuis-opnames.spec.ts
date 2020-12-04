import { MunicipalContext } from 'cypress/integration/types';
import { beforeMunicipalTests } from 'cypress/support/beforeMunicipalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Ziekenhuis opnames', () => {
  swallowResizeObserverError();

  before(() => {
    beforeMunicipalTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.hospital_admissions.last_value;

    const kpiTestInfo = {
      moving_average_hospital: formatNumber(lastValue.moving_average_hospital),
    };

    checkKpiValues(kpiTestInfo);
  });
});
