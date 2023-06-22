import { blockFields } from './block-fields';

export const inlineBlock = {
  name: 'inlineBlock',
  type: 'object',
  title: 'Locale Block Content',
  fields: [
    {
      title: 'Text en andere inhoud',
      name: 'inlineBlockContent',
      type: 'array',
      of: blockFields,
    },
  ],
};
