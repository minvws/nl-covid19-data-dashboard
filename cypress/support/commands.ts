// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import { Municipal, National, Regionaal } from '~/types/data';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      beforeMunicipalTests(
        pageName: string,
        gmcode?: string
      ): Chainable<Element>;
      beforeNationalTests(pageName: string): Chainable<Element>;
      beforeRegionTests(pageName: string, vrcode?: string): Chainable<Element>;
      swallowResizeObserverError(): void;
      checkKpiValues(kpiTestInfo: Record<string, string | string[]>): void;
    }
  }
}

Cypress.Commands.add(
  'beforeMunicipal',
  (pageName: string, gmcode = 'GM0363') => {
    cy.swallowResizeObserverError();
    return cy
      .fixture<Municipal>(`${gmcode}.json`)
      .as('municipalData')
      .visit(`/gemeente/${gmcode}/${pageName}`);
  }
);

Cypress.Commands.add('beforeNationalTests', (pageName: string) => {
  cy.swallowResizeObserverError();
  return cy
    .fixture<National>('NL.json')
    .as('nationalData')
    .visit(`/landelijk/${pageName}`);
});

Cypress.Commands.add(
  'beforeRegionTests',
  (pageName: string, vrcode = 'VR13') => {
    cy.swallowResizeObserverError();
    return cy
      .fixture<Regionaal>(`${vrcode}.json`)
      .as('regionData')
      .visit(`/veiligheidsregio/${vrcode}/${pageName}`);
  }
);

Cypress.Commands.add('swallowResizeObserverError', () => {
  Cypress.on('uncaught:exception', (err, _runnable) => {
    // For some reason this error throws very often during cypress tests,
    // it doesn't crash anything, so for now we're just going to swallow
    // the error and continue testing...
    const errorMessage = err.toString();
    if (errorMessage.includes('ResizeObserver loop')) {
      return false;
    }
    return true;
  });
});

Cypress.Commands.add(
  'checkKpiValues',
  (kpiTestInfo: Record<string, string | string[]>) => {
    Object.entries(kpiTestInfo).forEach(([key, value]) => {
      const element = cy.dataCy(key);
      if (Array.isArray(value)) {
        value.forEach((val) => {
          element.contains(val);
        });
      } else {
        element.contains(value);
      }
    });
  }
);

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

export {};
