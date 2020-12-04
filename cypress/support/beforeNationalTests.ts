import { National } from '~/types/data';

export function beforeNationalTests(pageName: string) {
  cy.fixture<National>('NL.json')
    .as('nationalData')
    .visit(`/landelijk/${pageName}`);
}
