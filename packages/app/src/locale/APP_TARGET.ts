/** This file is meant to trick TypeScript. We're using a webpack plugin to
 * rewrite some imports based on desired locale. This file just exports the
 * type from the NL file so all types still work.
 */
import locale from './nl.json';

export type TLocale = typeof locale;
export default locale;
