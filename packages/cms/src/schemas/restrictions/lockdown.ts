export const lockdown = {
  name: 'lockdown',
  type: 'document',
  title: 'Lockdown',
  __experimental_actions: ['create', 'update', 'publish'],
  fields: [
    {
      title: 'Titel van de lockdown',
      name: 'title',
      type: 'localeString',
    },
    {
      title: 'Lockdown boodschap',
      name: 'message',
      description:
        'Als de knop aanstaat tonen wij deze waarschuwing op de landingspagina',
      type: 'object',
      fields: [
        { title: 'Titel', name: 'title', type: 'localeString' },
        { title: 'Lopende tekst', name: 'description', type: 'localeBlock' },
      ],
    },
    {
      title: 'Lockdown groepen',
      description: 'De maatregelen zijn onderverdeeld in groepen',
      name: 'groups',
      type: 'array',
      of: [{ type: 'restrictionGroupLockdown' }],
    },
  ],
};
