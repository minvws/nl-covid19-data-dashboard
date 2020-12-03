export function checkKpiValues(kpiTestInfo: Record<string, string | string[]>) {
  Object.entries(kpiTestInfo).forEach(([key, value]) => {
    const element = cy.get(`[data-cy=${key}]`);
    if (Array.isArray(value)) {
      value.forEach((val) => {
        element.contains(val);
      });
    } else {
      element.contains(value);
    }
  });
}
