import { NationalContext } from 'cypress/integration/types';
import { beforeNationalTests } from 'cypress/support/beforeNationalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Landelijk - Verdenkingen huisartsen', () => {
  swallowResizeObserverError();

  before(() => {
    beforeNationalTests('verdenkingen-huisartsen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const huistartsenLastValue = this.nationalData.verdenkingen_huisartsen
      .last_value;

    const kpiTestInfo = {
      geschat_aantal: formatNumber(huistartsenLastValue.geschat_aantal),
      incidentie: formatNumber(huistartsenLastValue.incidentie),
    };

    checkKpiValues(kpiTestInfo);
  });
});
