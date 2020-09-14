import replaceVariablesInText from './replaceVariablesInText';

import regios from 'data';
import municipalities from 'data/gemeente_veiligheidsregio.json';

export { getLocalTitleForRegion, getLocalTitleForMuncipality };

function getLocalTitleForRegion(title: string, code: string): string {
  const regio = regios.find((regio) => regio.code === code);

  if (!regio) return '';

  return replaceVariablesInText(title, {
    safetyRegion: regio.name,
  });
}

function getLocalTitleForMuncipality(title: string, code: string): string {
  const municipality = municipalities.find((mun) => mun.gemcode === code);

  if (!municipality) return '';

  return replaceVariablesInText(title, {
    municipality: municipality.displayName || municipality.name,
  });
}
