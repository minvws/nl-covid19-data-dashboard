import { Rule } from '~/sanity';
import { SupportedLanguageId } from './supported-languages';

type GetRule = (fieldRule: Rule, language: SupportedLanguageId) => Rule;

export function localeValidation(getRule: GetRule) {
  return (rule: Rule) =>
    rule.fields({
      /**
       * FieldRules need to be reset to prevent a sanity error which would
       * validate all fields of the same type in a document.
       * https://github.com/sanity-io/sanity/issues/1661#issuecomment-761813272
       */
      nl: (fieldRule: Rule) => getRule(fieldRule.reset(), 'nl'),
      en: (fieldRule: Rule) => getRule(fieldRule.reset(), 'en'),
    });
}

/**
 * Caution: Only use this validator on fields of type `localeString`.
 */
export function localeStringValidation(getRule: GetRule) {
  return localeValidation((rule, lang) =>
    getRule(rule.type('String'), lang)
      /**
       * Add a custom validation which will report a validation-error when the
       * document type doesn't match "localeString"
       */
      .custom((_: any, context: any) => {
        if (context.parent._type !== 'localeString') {
          return `Cannot apply localeStringValidation on document type ${context.parent._type}. Please use the localeValidation or write a custom validation without locale wrapper.`;
        }

        return true;
      })
  );
}
