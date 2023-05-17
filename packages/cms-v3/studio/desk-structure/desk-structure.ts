import { BsInfoCircle, BsMailbox, BsUniversalAccessCircle } from 'react-icons/bs';
import { StructureBuilder, StructureResolverContext } from 'sanity/desk';
import { addStructureItem } from '../utils';
import { dataExplainedStructureItem } from './data-explained-structure-item';
import { elementsStructureItem } from './elements-structure-item';
import { faqStructureItem } from './faq-structure-item';
import { homepageStructureItem } from './homepage-structure-item';
import { lokalizeStructureItem } from './lokalize-structure-item';
import { notFoundPageStructureItem } from './not-found-page-structure-item';
import { pagePartsStructureItem } from './page-parts-structure-item';
import { pagesStructureItem } from './pages-structure-item';

export const DeskStructure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .id('content')
    .title('Content')
    .items([
      pagesStructureItem(S, context),
      lokalizeStructureItem(S, context),
      elementsStructureItem(S, context),
      addStructureItem(S, BsInfoCircle, 'Over dit dashboard', 'overDitDashboard'),
      faqStructureItem(S),
      dataExplainedStructureItem(S),
      addStructureItem(S, BsUniversalAccessCircle, 'Toegankelijkheid', 'toegankelijkheid'),
      addStructureItem(S, BsMailbox, 'Contact', 'contact'),

      S.divider(),

      homepageStructureItem(S),

      notFoundPageStructureItem(S),

      // pagePartsStructureItem(S),

      // TODO: add the following structure items
      //  - Page parts
      //  - Homepage
      //  - Rest (check if this is actually necessary)

      // Grafieken is to be ignored
    ]);
