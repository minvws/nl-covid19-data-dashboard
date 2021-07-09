import { Rule } from '~/sanity';
import { SupportedLanguageId } from './supported-languages';

type GetRule = (fieldRule: Rule, language: SupportedLanguageId) => Rule;

export function localeValidation(getRules: GetRule) {
  return (rule: Rule) =>
    rule.fields({
      nl: (fieldRule: Rule) => getRules(fieldRule.reset(), 'nl'),
      en: (fieldRule: Rule) => getRules(fieldRule.reset(), 'en'),
    });
}

export function localeStringValidation(getRules: GetRule) {
  return localeValidation((rule, lang) => getRules(rule.type('String'), lang));
}
