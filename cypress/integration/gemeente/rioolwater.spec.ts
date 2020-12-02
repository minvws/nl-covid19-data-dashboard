import { checkKpiValues } from 'cypress/support/checkKpiValues';
import { swallowResizeObserverError } from 'cypress/support/swallowResizeObserverError';
import { Context } from 'mocha';
import { Municipal } from '~/types/data';
import { formatNumber } from '~/utils/formatNumber';

context('Gemeente - Rioolwater', () => {
  swallowResizeObserverError();

  const gmcode = 'GM0363';

  before(() => {
    cy.fixture<Municipal>(`${gmcode}.json`).as('gemeente');
    cy.visit(`/gemeente/${gmcode}/rioolwater`);
  });

  it('Should show the correct KPI values', function (this: Context & {
    gemeente: Municipal;
  }) {
    const kpiTestInfo = {
      barscale_value: formatNumber(this.gemeente.sewer?.last_value.average),
      total_installation_count: formatNumber(
        this.gemeente.sewer?.last_value.total_installation_count
      ),
    };

    checkKpiValues(kpiTestInfo);
  });
});
