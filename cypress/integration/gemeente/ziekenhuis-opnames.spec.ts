import { MunicipalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeMunicipalTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.hospital_admissions.last_value;

    const kpiTestInfo = {
      moving_average_hospital: formatNumber(lastValue.moving_average_hospital),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
