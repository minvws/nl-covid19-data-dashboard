import { BsCollection } from 'react-icons/bs';
import { KpiIconInput as MeasuresIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const measuresCollection = {
  title: 'Maatregelen groep',
  name: 'measuresCollection',
  type: 'document',
  fields: [
    {
      title: 'Maatregel groep',
      description: 'Waar gaat deze maatregel groep over?',
      name: 'title',
      type: 'localeString',
    },
    {
      title: 'Icoon',
      description: 'Welk icoon moet er naast de maatregelen groep staan?',
      name: 'icon',
      type: 'string',
      inputComponent: MeasuresIconInput,
    },
    {
      title: 'Maatregel',
      name: 'measuresItems',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'measuresItem' } }],
    },
  ],
  preview: {
    select: {
      title: 'title.nl',
      icon: 'icon',
    },
    prepare(selection: { title: string }) {
      const { title } = selection;

      return {
        title: title,
        media: BsCollection,
      };
    },
  },
};
