import { GmContext } from '~/integration/types';

context('Gemeente - Actueel', () => {
  before(() => {
    cy.beforeGmTests('', 'GM0363', '/actueel');
  });

  it('Should show the correct mini trend tile values', function (this: GmContext) {
    const testedOverallLastValue = this.municipalData.tested_overall.last_value;
    const hospitalNiceLastValue = this.municipalData.hospital_nice.last_value;

    const kpiTestInfo = {
      admissions_on_date_of_reporting: cy.formatters.formatNumber(
        hospitalNiceLastValue.admissions_on_date_of_reporting
      ),
      infected: cy.formatters.formatNumber(testedOverallLastValue.infected),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
