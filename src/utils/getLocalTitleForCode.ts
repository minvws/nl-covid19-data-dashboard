import { replaceVariablesInText } from './replaceVariablesInText';

import regios from '~/data/index';
import municipalities from '~/data/gemeente_veiligheidsregio.json';

export function getLocalTitleForRegion(title: string, code: string): string {
  const regio = regios.find((regio) => regio.code === code);

  if (!regio) return '';

  return replaceVariablesInText(title, {
    safetyRegion: regio.name,
  });
}

export function getLocalTitleForMunicipality(
  title: string,
  code: string
): string {
  const municipality = municipalities.find((mun) => mun.gemcode === code);

  if (!municipality) return '';

  return replaceVariablesInText(title, {
    municipality: municipality.displayName || municipality.name,
  });
}
