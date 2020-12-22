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

// Must be declared global to be detected by typescript (allows import/export)
// eslint-disable @typescript/interface-name
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      /**
       * Page navigation for general pages (about pages, etc)
       *
       * @param pageName
       */
      beforeGeneralTests(pageName: string): void;
      /**
       * Fixture loading and page navigation for municipal page tests
       *
       * @param pageName
       * @param gmcode
       */
      beforeMunicipalTests(pageName: string, gmcode?: string): void;
      /**
       * Fixture loading and page navigation for national page tests
       *
       * @param pageName
       */
      beforeNationalTests(pageName: string): void;
      /**
       * Fixture loading and page navigation for regional page tests
       *
       * @param pageName
       * @param vrcode
       */
      beforeRegionTests(pageName: string, vrcode?: string): void;
      /**
       * Ignores any errors coming out of the ResizeObserver
       */
      swallowResizeObserverError(): void;
      /**
       * Checks a list of values against their associated of data-cy IDs
       *
       * @param kpiTestInfo
       */
      checkKpiValues(kpiTestInfo: Record<string, string | string[]>): void;
      /**
       * Checks if there is only ONE <h1> element on the page
       *
       */
      checkHeadings(): void;
    }
  }
}

Cypress.Commands.add('checkHeadings', () => {
  const headings = Cypress.$('h1');
  expect(headings.length).to.equal(
    1,
    'More than one <H1> element was found on the page, only one is allowed. This might be because there are multiple <ContentHeader> components on the page that all have a category prop assigned. This prop is rendered as an <H1> element. Remove one of those props to fix this error.'
  );
});

Cypress.Commands.add('beforeGeneralTests', (pageName: string) => {
  cy.visit(`/${pageName}`);

  cy.checkHeadings();
});

Cypress.Commands.add(
  'beforeMunicipalTests',
  (pageName: string, gmcode = 'GM0363') => {
    cy.swallowResizeObserverError();

    cy.fixture<Municipal>(`${gmcode}.json`)
      .as('municipalData')
      .visit(`/gemeente/${gmcode}/${pageName}`);

    cy.checkHeadings();
  }
);

Cypress.Commands.add('beforeNationalTests', (pageName: string) => {
  cy.swallowResizeObserverError();

  cy.fixture<National>('NL.json')
    .as('nationalData')
    .visit(`/landelijk/${pageName}`);

  cy.checkHeadings();
});

Cypress.Commands.add(
  'beforeRegionTests',
  (pageName: string, vrcode = 'VR13') => {
    cy.swallowResizeObserverError();

    cy.fixture<Regionaal>(`${vrcode}.json`)
      .as('regionData')
      .visit(`/veiligheidsregio/${vrcode}/${pageName}`);

    cy.checkHeadings();
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
        value.forEach((val) => element.contains(val));
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
