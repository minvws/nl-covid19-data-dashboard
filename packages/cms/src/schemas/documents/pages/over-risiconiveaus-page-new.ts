import { localeStringValidation, localeValidation } from '../../../language/locale-validation';

export const overRisiconiveausNew = {
  name: 'overRisicoNiveausNew',
  type: 'document',
  title: 'Over risiconiveaus',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
      validation: localeStringValidation((rule) => rule.required()),
    },
    {
      title: 'Content',
      name: 'content',
      type: 'localeRichContentBlock',
      validation: localeValidation((rule) => rule.required()),
    },
  ],
};
