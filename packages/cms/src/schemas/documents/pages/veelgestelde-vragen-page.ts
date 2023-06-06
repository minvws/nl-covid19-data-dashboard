export const veelgesteldeVragen = {
  name: 'veelgesteldeVragen',
  type: 'document',
  title: 'Veelgestelde vragen pagina',
  fields: [
    {
      name: 'title',
      type: 'localeString',
      title: 'Titel',
    },
    {
      name: 'description',
      type: 'localeBlock',
      title: 'Beschrijving',
    },
    {
      name: 'questions',
      type: 'array',
      title: 'Vragen',
      description:
        'Je kan veelgestelde vragen toevoegen, de volgorde veranderen, de tekst bijwerken of verwijderen. Om de groepen en vragen opnieuw te ordenen, hoeft je slechts één van de vragen in een groep te verplaatsen. Waar de eerste vraag van een bepaalde groep staat, is waar de groep zal verschijnen op de Veelgestelde vragen pagina. Heb je bijvoorbeeld één vraag uit de groep Algemeen bovenaan en de andere vragen onderaan de lijst, dan wordt de groep Algemeen als eerste groep getoond.',
      of: [{ type: 'reference', to: { type: 'faqQuestion' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      subtitle: 'description.nl',
    },
  },
};
