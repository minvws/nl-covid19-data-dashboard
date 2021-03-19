// import { RegionalContext } from '~/integration/types';
// import { formatNumber } from '@corona-dashboard/common';

// context('Regionaal - Ziekenhuis opnames', () => {
//   before(() => {
//     cy.beforeRegionTests('ziekenhuis-opnames');
//   });

//   xit('Should show the correct KPI values', async function (this: RegionalContext) {
//     const lastValue = this.regionData.hospital_nice.last_value;

//     const kpiTestInfo = {
//       admissions_on_date_of_reporting: formatNumber(
//         lastValue.admissions_on_date_of_reporting
//       ),
//     };

//     cy.checkKpiValues(kpiTestInfo);
//   });
// });
