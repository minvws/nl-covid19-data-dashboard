export default {
  title: 'Default',
  name: 'messageException',
  type: 'object',
  fields: [
    { name: 'match', type: 'string', title: 'Match' },
    { name: 'field', type: 'string', title: 'Veld' },
    { name: 'value', type: 'localeString', title: 'Waarde' },
  ],
  preview: {
    select: {
      title: 'match',
      subtitle: 'field',
    },
  },
};
