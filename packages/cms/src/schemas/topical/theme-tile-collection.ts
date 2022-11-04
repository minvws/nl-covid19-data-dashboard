export const themeTileCollection = {
  type: 'object',
  title: 'Thema tegel collectie',
  name: 'themeTileCollection',
  fields: [
    {
      title: 'Tegels',
      description: 'De tegels',
      name: 'tiles',
      type: 'array',
      of: [{ type: 'themeTile' }],
    },
  ],
};
