export const TITLE_DESCRIPTION_FIELDS = [
  {
    name: 'title',
    type: 'localeString',
    title: 'Titel',
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required(),
        en: (fieldRule: any) => fieldRule.reset().required(),
      }),
  },
  {
    name: 'content',
    type: 'localeBlock',
    title: 'Inhoud',
    validation: (Rule: any) =>
      Rule.fields({
        nl: (fieldRule: any) => fieldRule.reset().required(),
        en: (fieldRule: any) => fieldRule.reset().required(),
      }),
  },
];
