// import { NationalContext } from '~/integration/types';
// import {  getLastFilledValue } from '@corona-dashboard/common';

// context('Landelijk - Besmettelijke mensen', () => {
//   before(() => {
//     cy.beforeNationalTests('besmettelijke-mensen');
//   });

//   it('Should show the correct KPI values', function (this: NationalContext) {
//     const lastValue = getLastFilledValue(this.nationalData.infectious_people);

//     const kpiTestInfo = {
//       estimate: formatNumber(lastValue.estimate),
//     };

//     cy.checkKpiValues(kpiTestInfo);
//   });
// });
