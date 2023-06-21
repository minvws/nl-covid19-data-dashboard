import { KpiIconInput } from '../../../components/portable-text/kpi-configuration/kpi-icon-input';
import { prepareLocalized } from '../../../plugins/translate/prepare-localized';
import { REQUIRED } from '../../../validation';

export const cijferVerantwoordingGroups = {
  name: 'cijferVerantwoordingGroups',
  type: 'document',
  title: 'Cijfer verantwoording groepen',
  fields: [
    {
      name: 'group',
      type: 'localeString',
      title: 'Groepsnaam',
      validation: REQUIRED,
    },
    {
      name: 'icon',
      type: 'string',
      title: 'Groepsicoon',
      inputComponent: KpiIconInput,
      validation: REQUIRED,
    },
  ],
  preview: {
    select: {
      title: 'group',
    },
    prepare: prepareLocalized,
  },
};
