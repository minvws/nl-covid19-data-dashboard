import { localeValidation } from '../../../language/locale-validation';

export const overRisiconiveaus = {
  name: 'overRisicoNiveaus',
  type: 'document',
  title: 'Over risico niveaus',
  fields: [
    {
      title: 'Content',
      name: 'content',
      type: 'localeRichContentBlock',
      validation: localeValidation((rule) => rule.required()),
    },
  ],
};
