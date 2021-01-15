import { MunicipalContext } from '~/integration/types';
import { formatNumber } from '@corona-dashboard/common';

context('Gemeente - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeMunicipalTests('ziekenhuis-opnames');
  });

  xit('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.hospital_nice.last_value;

    const kpiTestInfo = {
      admissions_moving_average: formatNumber(
        lastValue.admissions_on_date_of_admission
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
