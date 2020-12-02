export function swallowResizeObserverError() {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // For some reason this error throws very often during cypress tests,
    // it doesn't crash anything, so for now we're just going to swallow
    // the error and continue testing...
    const errorMessage = err.toString();
    if (errorMessage.includes('ResizeObserver loop')) {
      return false;
    }
    return true;
  });
}
