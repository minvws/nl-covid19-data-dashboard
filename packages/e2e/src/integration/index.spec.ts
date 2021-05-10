import {
  National,
  sortTimeSeriesInDataInPlace,
} from '@corona-dashboard/common';
import { NationalContext } from './types';

context('Index (Actueel)', () => {
  before(() => {
    cy.swallowResizeObserverError();

    cy.fixture<National>('NL.json')
      .then((nationalData) => {
        sortTimeSeriesInDataInPlace(nationalData);
      })
      .as('nationalData')
      .visit(`/`);

    cy.checkHeadings();
  });

  it('Should show the correct mini trend tile values', function (this: NationalContext) {
    const testedOverallLastValue = this.nationalData.tested_overall.last_value;
    const hospitalNiceLastValue = this.nationalData.hospital_nice.last_value;

    const kpiTestInfo = {
      admissions_on_date_of_reporting: cy.formatters.formatNumber(
        hospitalNiceLastValue.admissions_on_date_of_reporting
      ),
      infected: cy.formatters.formatNumber(testedOverallLastValue.infected),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
