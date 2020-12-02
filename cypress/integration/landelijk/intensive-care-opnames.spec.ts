import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
import { National } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';

context('Landelijk - IC Opnames', () => {
  swallowResizeObserverError();

  before(() => {
    cy.fixture<National>('NL.json').as('national');
    cy.visit('/landelijk/intensive-care-opnames');
  });

  it('Should show the correct KPI values', function (this: Context & {
    national: National;
  }) {
    const kpiTestInfo = {
      covid_occupied: [
        formatNumber(
          this.national.intensive_care_beds_occupied.last_value.covid_occupied
        ),
        `(${formatPercentage(
          this.national.intensive_care_beds_occupied.last_value
            .covid_percentage_of_all_occupied
        )}%)`,
      ],
    };

    checkKpiValues(kpiTestInfo);
  });
});
