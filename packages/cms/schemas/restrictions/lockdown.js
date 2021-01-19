export default {
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
      title: 'Schakel lockdown in?',
      name: 'lockdown',
      description:
        'In een lockdown is de routekaart minder van belang. Als deze knop aanstaat tonen wij niet de routekaart, maar de lockdown maatregelen.',
      type: 'boolean',
    },
    {
      title: 'Lockdown melding',
      name: 'message',
      description:
        'Als de knop aanstaat tonen wij deze waarschuwing op de landingspagina',
      type: 'localeBlock',
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
