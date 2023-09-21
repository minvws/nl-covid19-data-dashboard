import { defineField, defineType } from 'sanity';

export const contactPageItemLink = defineType({
  name: 'contactPageItemLink',
  title: 'Contactpagina Itemlink',
  description:
    'Configureer een link voor een bepaald pagina-item. Kies het linktype en voeg een label toe. Als u een link aan een e-mail wilt toevoegen, vult u alleen het e-mailadres in. Als je een link naar een telefoonnummer wilt toevoegen, voeg dan alleen het nummer toe.',
  type: 'document',
  fields: [
    defineField({
      name: 'link',
      title: 'Link',
      description:
        "Configureer de link en het bijbehorende label. Als de link een telefoonnummer is, vermijd dan het gebruik van spaties. Als het een internationaal nummer is, vervang dan '+' door '00'.",
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'linkType',
      type: 'linkType',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Link Titel',
      description: 'Configureer indien nodig een titel die boven de link wordt weergegeven. Dit is niet het linklabel. Gebruik dit alleen als het linklabel niet voldoende is.',
      type: 'localeString',
    }),
  ],
  preview: {
    select: {
      title: 'link.title.nl',
      subtitle: 'link.href',
    },
  },
});
