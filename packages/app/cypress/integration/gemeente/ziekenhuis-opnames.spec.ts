import { MunicipalContext } from 'cypress/integration/types';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeMunicipalTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.hospital_nice.last_value;

    const kpiTestInfo = {
      admissions_moving_average: formatNumber(
        lastValue.admissions_moving_average
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
