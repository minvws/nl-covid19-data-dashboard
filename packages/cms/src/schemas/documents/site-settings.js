export default {
  name: 'siteSettings',
  type: 'document',
  title: 'Site Settings',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Titel van de website',
    },
    {
      title: 'SEO Instellingen',
      name: 'openGraph',
      description:
        'Dit zijn de standaard SEO instellingen voor het CoronaDashboard.',
      type: 'openGraph',
    },
  ],
};
