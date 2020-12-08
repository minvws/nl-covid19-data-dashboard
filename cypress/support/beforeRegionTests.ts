import { Regionaal } from '~/types/data';

export function beforeRegionTests(pageName: string, vrcode = 'VR13') {
  cy.fixture<Regionaal>(`${vrcode}.json`)
    .as('regionData')
    .visit(`/veiligheidsregio/${vrcode}/${pageName}`);
}
