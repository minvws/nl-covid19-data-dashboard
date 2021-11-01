import { Rule } from '~/sanity';
import { whenNotAdministrator } from '../../roles/when-not-administrator';

export const PAGE_IDENTIFIER_FIELDS = [
  {
    title: 'Menu titel',
    name: 'title',
    type: 'string',
    hidden: whenNotAdministrator,
    validation: (rule: Rule) => rule.required(),
  },
  {
    title: 'Pagina ID',
    name: 'pageIdentifier',
    type: 'reference',
    to: { type: 'pageIdentifier' },
    hidden: whenNotAdministrator,
    validation: (rule: Rule) => rule.required(),
  },
];
