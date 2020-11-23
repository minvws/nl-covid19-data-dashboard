export function getTextByDataCy(container: HTMLElement, dataCyValue: string) {
  const elm = container.querySelector(`[data-cy="${dataCyValue}"]`);
  return elm?.textContent;
}
