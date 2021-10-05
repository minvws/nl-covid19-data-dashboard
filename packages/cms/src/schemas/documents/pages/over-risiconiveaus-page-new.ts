import { localeValidation } from '../../../language/locale-validation';

export const overRisiconiveausNew = {
  name: 'overRisicoNiveausNew',
  type: 'document',
  title: 'Over risico niveaus 2',
  fields: [
    {
      title: 'Content',
      name: 'content',
      type: 'localeRichContentBlock',
      validation: localeValidation((rule) => rule.required()),
    },
  ],
};
