export const themeLinkCollection = {
  type: 'object',
  title: 'Thema link collectie',
  name: 'themeLinkCollection',
  fields: [
    {
      title: 'Links',
      name: 'links',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'themeLink' } }],
    },
  ],
};
