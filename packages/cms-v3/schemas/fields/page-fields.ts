import { defineField } from 'sanity';
import { whenNotAdministrator } from '../../studio/roles';

export const PAGE_IDENTIFIER_REFERENCE_FIELDSET = {
  title: 'Pagina Configuratie',
  name: 'pageConfiguration',
  options: {
    collapsible: true,
    collapsed: true,
  },
};

export const PAGE_IDENTIFIER_REFERENCE_FIELDS = [
  defineField({
    title: 'Menu titel (This value is only used in the Sanity UI, not anywhere on the dashboard)',
    name: 'title',
    type: 'string',
    hidden: whenNotAdministrator,
    fieldset: 'pageConfiguration',
    validation: (rule) => rule.required(),
  }),
  defineField({
    title: 'Pagina ID',
    name: 'pageIdentifier',
    type: 'reference',
    to: { type: 'pageIdentifier' },
    hidden: whenNotAdministrator,
    fieldset: 'pageConfiguration',
    validation: (rule) => rule.required(),
  }),
  defineField({
    title: 'Pagina data soort',
    name: 'pageDataKind',
    type: 'string',
    hidden: whenNotAdministrator,
    fieldset: 'pageConfiguration',
    validation: (rule) => rule.required(),
  }),
];
