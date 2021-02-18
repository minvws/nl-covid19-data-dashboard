import { get, set } from 'lodash';
import { Locale } from '~/locale';
import { MDToHTMLString } from './MDToHTMLString';

/**
 * This is a list of keys which contain markdown syntax
 */
const MARKDOWN_KEYS = [
  'regionaal_index.belangrijk_bericht',
  'vaccinaties.section_vaccinations_more_information.description',
  'veiligheidsregio_index.selecteer_toelichting',
  'veiligheidsregio_index.belangrijk_bericht',
  'over_risiconiveaus.paragraaf',
  'over_beschrijving.text',
  'over_veelgestelde_vragen.vragen[].antwoord',
  'over_risiconiveaus.vragen[].antwoord',
  'verantwoording.cijfers[].verantwoording',
  'positief_geteste_personen.kpi_toelichting',
  'veiligheidsregio_positief_geteste_personen.kpi_toelichting',
  'gemeente_positief_geteste_personen.kpi_toelichting',
  'nationaal_actueel.risiconiveaus.selecteer_toelichting',
  'veiligheidsregio_actueel.risiconiveaus.selecteer_toelichting',
  'gemeente_actueel.risiconiveaus.selecteer_toelichting',
  'vaccinaties.gezette_prikken.tab_first.description',
  'vaccinaties.gezette_prikken.tab_second.description',
  'vaccinaties.grafiek.omschrijving',
  'vr_risiconiveau.positieve_testen.description',
  'vr_risiconiveau.ziekenhuisopnames.description',
  'vr_risiconiveau.types[1].toelichting',
  'vr_risiconiveau.types[2].toelichting',
  'vr_risiconiveau.types[3].toelichting',
  'vr_risiconiveau.types[4].toelichting',
];

export function parseMarkdownInLocale(text: Locale) {
  const textClone = JSON.parse(JSON.stringify(text)) as Locale;

  MARKDOWN_KEYS.forEach((key) => replaceWithMarkdown(textClone, key));

  return textClone;
}

function replaceWithMarkdown<T extends Record<string, unknown>>(
  object: T | T[],
  path: string
) {
  if (Array.isArray(object)) {
    object.forEach((obj) => replaceWithMarkdown(obj, path));
    return;
  }

  if (path.includes('[].')) {
    const [key, ...paths] = path.split('[].');
    replaceWithMarkdown(
      get(object, key) as Record<string, unknown>,
      paths.join('[].')
    );
    return;
  }

  const value = get(object, path) as string | undefined;

  if (value) {
    set(object, path, MDToHTMLString(value));
  }
}
