import { Rule } from '~/sanity';
import { SupportedLanguageId } from './supported-languages';

type GetRules = (
  fieldRule: Rule,
  language: SupportedLanguageId
) => Rule | Rule[];

export function localeValidation(getRules: GetRules) {
  return (rule: Rule) =>
    rule.fields({
      nl: (fieldRule: Rule) => getRules(fieldRule, 'nl'),
      en: (fieldRule: Rule) => getRules(fieldRule, 'en'),
    });
}

export function localeStringValidation(getRules: GetRules) {
  return localeValidation((rule, lang) => getRules(rule.type('String'), lang));
}
