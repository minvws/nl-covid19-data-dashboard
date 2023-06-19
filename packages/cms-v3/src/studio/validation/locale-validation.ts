import { Rule, ValidationContext } from 'sanity';

type GetRule = (fieldRule: Rule, language: 'nl' | 'en') => Rule;

interface LocaleStringValidationContextParent {
  _type: string;
}

const isLocaleStringValidationContextParent = (parent: unknown): parent is LocaleStringValidationContextParent =>
  typeof parent === 'object' && parent !== null && '_type' in parent;

export const localeValidation = (getRule: GetRule) => {
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
};

/**
 * Caution: Only use this validator on fields of type `localeString`.
 */
export const localeStringValidation = (getRule: GetRule) => {
  return localeValidation((rule, lang) =>
    getRule(rule.type('String'), lang)
      /**
       * Add a custom validation which will report a validation-error when the
       * document type doesn't match "localeString"
       */
      .custom((_, context: ValidationContext) => {
        const parent = context.parent;
        if (!parent) return true;

        const isParent = isLocaleStringValidationContextParent(parent);
        if (!isParent) return true;

        if (parent._type !== 'localeString') {
          return `Cannot apply localeStringValidation on document type ${parent._type}. Please use the localeValidation or write a custom validation without locale wrapper.`;
        }

        return true;
      })
  );
};
