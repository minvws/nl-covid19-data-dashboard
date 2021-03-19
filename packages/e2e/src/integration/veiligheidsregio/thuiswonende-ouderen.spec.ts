// import { RegionalContext } from '~/integration/types';
// import { formatNumber } from '@corona-dashboard/common';

// context('Regionaal - Thuiswonende ouderen', () => {
//   before(() => {
//     cy.beforeRegionTests('thuiswonende-ouderen');
//   });

//   it('Should show the correct KPI values', function (this: RegionalContext) {
//     const lastValue = this.regionData.elderly_at_home.last_value;

//     const kpiTestInfo = {
//       positive_tested_daily: formatNumber(lastValue.positive_tested_daily),
//       positive_tested_daily_per_100k: formatNumber(
//         lastValue.positive_tested_daily_per_100k
//       ),
//       deceased_daily: formatNumber(lastValue.deceased_daily),
//     };

//     cy.checkKpiValues(kpiTestInfo);
//   });
// });
