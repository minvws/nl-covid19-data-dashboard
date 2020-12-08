import { Municipal } from '~/types/data';

export function beforeMunicipalTests(pageName: string, gmcode = 'GM0363') {
  cy.fixture<Municipal>(`${gmcode}.json`)
    .as('municipalData')
    .visit(`/gemeente/${gmcode}/${pageName}`);
}
