import { MunicipalContext } from 'cypress/integration/types';
import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Ziekenhuis opnames', () => {
  swallowResizeObserverError();

  const gmcode = 'GM0363';

  before(() => {
    cy.fixture<Municipal>(`${gmcode}.json`).as('municipalData');
    cy.visit(`/gemeente/${gmcode}/ziekenhuis-opnames`);
  });

  xit('Should show the correct KPI values', function (this: MunicipalContext) {
    const kpiTestInfo = {
      moving_average_hospital: formatNumber(
        this.municipalData.hospital_admissions.last_value
          .moving_average_hospital
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
