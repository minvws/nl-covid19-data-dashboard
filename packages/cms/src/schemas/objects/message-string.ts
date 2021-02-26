export default {
  title: 'Default',
  name: 'messageString',
  type: 'object',
  fields: [
    { name: 'value', type: 'localeString', title: 'Waarde' },
    {
      name: 'exceptions',
      type: 'array',
      title: 'Overschrijvingen',
      of: [{ type: 'messageStringException' }],
    },
  ],
  preview: {
    select: {
      title: 'value.nl',
    },
  },
};
