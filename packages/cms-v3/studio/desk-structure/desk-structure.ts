import { StructureBuilder, StructureResolverContext } from 'sanity/desk';
import { addListItem } from '../utils';
import { lokalizeStructureItem } from './lokalize-structure-item';
import { BsInfoCircle } from 'react-icons/bs';

export const DeskStructure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .id('content')
    .title('Content')
    .items([lokalizeStructureItem(S, context), addListItem(S, BsInfoCircle, 'Over dit dashboard', 'overDitDashboard')]);
