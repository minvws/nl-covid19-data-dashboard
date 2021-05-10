import { MunicipalContext } from '~/integration/types';

context('Gemeente - Ziekenhuis opnames', () => {
  before(() => {
    cy.beforeMunicipalTests('ziekenhuis-opnames');
  });

  it('Should show the correct KPI values', function (this: MunicipalContext) {
    const lastValue = this.municipalData.hospital_nice.last_value;

    const kpiTestInfo = {
      admissions_on_date_of_reporting: cy.formatters.formatNumber(
        lastValue.admissions_on_date_of_reporting
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
