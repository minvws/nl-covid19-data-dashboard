import { BsViewList } from 'react-icons/bs';
import { KpiIconInput as MeasuresIconInput } from '../../components/portable-text/kpi-configuration/kpi-icon-input';

export const measuresItem = {
  type: 'document',
  title: 'Maatregel',
  name: 'measuresItem',
  fields: [
    {
      title: 'Maatregel',
      description: 'Beschrijf de maatregel voor deze categorie',
      name: 'title',
      type: 'localeString',
    },
    {
      title: 'Icoon',
      description: 'Welk icoon moet er naast de maatregel staan?',
      name: 'icon',
      type: 'string',
      inputComponent: MeasuresIconInput,
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
        media: BsViewList,
      };
    },
  },
};
