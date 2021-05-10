import { NationalContext } from '~/integration/types';

context('Landelijk - Verdenkingen huisartsen', () => {
  before(() => {
    cy.beforeNationalTests('verdenkingen-huisartsen');
  });

  it('Should show the correct KPI values', function (this: NationalContext) {
    const lastValue = this.nationalData.doctor.last_value;

    const kpiTestInfo = {
      covid_symptoms: cy.formatters.formatNumber(lastValue.covid_symptoms),
      covid_symptoms_per_100k: cy.formatters.formatNumber(
        lastValue.covid_symptoms_per_100k
      ),
    };

    cy.checkKpiValues(kpiTestInfo);
  });
});
