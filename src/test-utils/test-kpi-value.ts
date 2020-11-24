import { getTextByDataCy } from './get-text-by-data-cy';

export function testKpiValue(
  container: HTMLElement,
  dataCyValue: string,
  expectedText: string
) {
  const actualText = getTextByDataCy(container, dataCyValue);

  expect(actualText).toEqual(expectedText);
}
