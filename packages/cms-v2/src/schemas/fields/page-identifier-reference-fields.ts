import { Rule } from '~/sanity';
import { whenNotAdministrator } from '../../roles/when-not-administrator';

export const PAGE_IDENTIFIER_REFERENCE_FIELDSET = {
  title: 'Pagina Configuratie',
  name: 'pageConfiguration',
  options: {
    collapsible: true,
    collapsed: true,
  },
};

export const PAGE_IDENTIFIER_REFERENCE_FIELDS = [
  {
    title: 'Menu titel (This value is only used in the Sanity UI, not anywhere on the dashboard)',
    name: 'title',
    type: 'string',
    hidden: whenNotAdministrator,
    fieldset: 'pageConfiguration',
    validation: (rule: Rule) => rule.required(),
  },
  {
    title: 'Pagina ID',
    name: 'pageIdentifier',
    type: 'reference',
    to: { type: 'pageIdentifier' },
    hidden: whenNotAdministrator,
    fieldset: 'pageConfiguration',
    validation: (rule: Rule) => rule.required(),
  },
  {
    title: 'Pagina data soort',
    name: 'pageDataKind',
    type: 'string',
    hidden: whenNotAdministrator,
    fieldset: 'pageConfiguration',
    validation: (rule: Rule) => rule.required(),
  },
];
