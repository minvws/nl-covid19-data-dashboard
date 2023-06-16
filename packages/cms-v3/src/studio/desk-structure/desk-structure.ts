import { BsInfoCircle, BsMailbox, BsUniversalAccessCircle } from 'react-icons/bs';
import { StructureBuilder, StructureResolverContext } from 'sanity/desk';
import { addStructureItem } from '../utils';
import { articlesStructureItem } from './articles-structure-item';
import { dataExplainedStructureItem } from './data-explained-structure-item';
import { elementsStructureItem } from './elements-structure-item';
import { faqStructureItem } from './faq-structure-item';
import { homepageStructureItem } from './homepage-structure-item';
import { lokalizeStructureItem } from './lokalize-structure-item';
import { notFoundPageStructureItem } from './not-found-page-structure-item';
import { pagePartsStructureItem } from './page-parts-structure-item';
import { pagesStructureItem } from './pages-structure-item';

export const deskStructure = (S: StructureBuilder, context: StructureResolverContext) =>
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

      articlesStructureItem(S),

      pagePartsStructureItem(S),
    ]);
