import { MunicipalContext } from 'cypress/integration/types';
import { beforeMunicipalTests } from 'cypress/support/beforeMunicipalTests';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Positief geteste mensen', () => {
  swallowResizeObserverError();

  before(() => {
    beforeMunicipalTests('positief-geteste-mensen');
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.positive_tested_people.last_value;

    const kpiTestInfo = {
      infected_daily_increase: formatNumber(lastValue.infected_daily_increase),
      infected_daily_total: formatNumber(lastValue.infected_daily_total),
    };

    checkKpiValues(kpiTestInfo);
  });
});
