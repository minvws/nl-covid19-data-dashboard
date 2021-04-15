// import { supportedLanguages } from '../../language/supported-languages';

// export default {
//   name: 'localeText',
//   type: 'object',
//   title: 'Locale Text Content',
//   validation: (Rule: any) =>
//     /**
//      * Only NL is required. For EN we use NL as a fallback when exporting. Both
//      * can be 1000 chars long (default is 120)
//      */
//     Rule.fields({
//       nl: (fieldRule: any) => fieldRule.reset().required(),
//       en: (fieldRule: any) => fieldRule.reset(),
//     }),
//   fields: supportedLanguages.map((lang) => ({
//     title: lang.title,
//     name: lang.id,
//     type: 'text',
//     rows: 4,
//   })),
// };

import { supportedLanguages } from '../../language/supported-languages';

export default {
  name: 'localeText',
  type: 'object',
  title: 'Locale Text Content',
  fields: supportedLanguages.map((lang) => ({
    title: lang.title,
    name: lang.id,
    type: 'text',
  })),
};
