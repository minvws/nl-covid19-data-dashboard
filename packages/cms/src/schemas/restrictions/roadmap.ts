export const roadmap = {
  name: 'roadmap',
  type: 'document',
  title: 'Routekaart',
  __experimental_actions: ['create', 'update', 'publish'],
  fields: [
    {
      title: 'Titel van de routekaart',
      name: 'title',
      type: 'localeString',
    },
    {
      title: 'Maatregelen categorien',
      description: 'De maatregelen zijn onderverdeeld in categorien',
      name: 'categories',
      type: 'array',
      of: [{ type: 'restrictionCategory' }],
    },
  ],
};
