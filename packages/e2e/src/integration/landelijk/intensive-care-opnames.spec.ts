import { NationalContext } from '~/integration/types';
import { formatNumber, formatPercentage } from '@corona-dashboard/common';

context('Landelijk - IC Opnames', () => {
  before(() => {
    cy.beforeNationalTests('intensive-care-opnames');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.intensive_care_lcps.last_value;

    const kpiTestInfo = {
      beds_occupied_covid: [
        formatNumber(lastValue.beds_occupied_covid),
        `(${formatPercentage(lastValue.beds_occupied_covid_percentage)}%)`,
      ],
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
