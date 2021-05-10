import { RegionalContext } from '~/integration/types';

context('Gemeente - Actueel', () => {
  before(() => {
    cy.beforeRegionTests('', 'VR13', '/actueel');
  });

  it('Should show the correct mini trend tile values', function (this: RegionalContext) {
    const testedOverallLastValue = this.regionData.tested_overall.last_value;
    const hospitalNiceLastValue = this.regionData.hospital_nice.last_value;

    const kpiTestInfo = {
      admissions_on_date_of_reporting: cy.formatters.formatNumber(
        hospitalNiceLastValue.admissions_on_date_of_reporting
      ),
      infected: cy.formatters.formatNumber(testedOverallLastValue.infected),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
