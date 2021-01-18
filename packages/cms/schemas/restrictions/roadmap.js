export default {
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
      title: 'Lockdown modus',
      name: 'lockdown',
      description:
        'In een lockdown is de routekaart minder van belang. Als deze knop aanstaat tonen wij niet de routekaart, maar de lockdown maatregelen.',
      type: 'object',
      fields: [
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
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [],
              lists: [],
              marks: {
                decorators: [],
              },
            },
          ],
        },
      ],
    },
    {
      title: 'Lockdown groepen',
      description: 'De lockdown maatregelen zijn onderverdeeld in groepen',
      name: 'groups',
      type: 'array',
      of: [{ type: 'restrictionGroupLockdown' }],
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
