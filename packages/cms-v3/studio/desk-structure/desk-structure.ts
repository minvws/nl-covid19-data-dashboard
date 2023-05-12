import { StructureBuilder, StructureResolverContext } from 'sanity/desk';
import { addStructureItem } from '../utils';
import { lokalizeStructureItem } from './lokalize-structure-item';
import { BsInfoCircle } from 'react-icons/bs';
import { pagePartStructureItem } from './page-part-structure-item';
import { elementsStructureItem } from './elements-structure-item';

export const DeskStructure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .id('content')
    .title('Content')
    .items([
      pagePartStructureItem(S, context),
      lokalizeStructureItem(S, context),
      elementsStructureItem(S, context),
      addStructureItem(S, BsInfoCircle, 'Over dit dashboard', 'overDitDashboard'),
    ]);
