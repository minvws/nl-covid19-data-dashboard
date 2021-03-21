// import { NationalContext } from '~/integration/types';
// import { formatNumber } from '@corona-dashboard/common';

// context('Landelijk - Verdenkingen huisartsen', () => {
//   before(() => {
//     cy.beforeNationalTests('verdenkingen-huisartsen');
//   });

//   it('Should show the correct KPI values', function (this: NationalContext) {
//     const lastValue = this.nationalData.doctor.last_value;

//     const kpiTestInfo = {
//       covid_symptoms: formatNumber(lastValue.covid_symptoms),
//       covid_symptoms_per_100k: formatNumber(lastValue.covid_symptoms_per_100k),
//     };

//     cy.checkKpiValues(kpiTestInfo);
//   });
// });
