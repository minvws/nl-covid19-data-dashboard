import { BsBarChart, BsBook, BsInfoCircle, BsMailbox, BsPuzzle, BsUniversalAccessCircle } from 'react-icons/bs';
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
import { coronaThermometerStructureItem } from './corona-thermometer-structure-item';

export const deskStructure = (S: StructureBuilder, context: StructureResolverContext) =>
  S.list()
    .id('content')
    .title('Content')
    .items([
      homepageStructureItem(S),
      S.divider(),
      pagesStructureItem(S, context),
      S.divider(),
      S.listItem()
        .id('ContentPage')
        .title('Dashboard Content Pages')
        .icon(BsBook)
        .child(
          S.list()
            .title('Content')
            .items([
              notFoundPageStructureItem(S),
              addStructureItem(S, BsInfoCircle, 'Over dit dashboard', 'overDitDashboard'),
              faqStructureItem(S),
              addStructureItem(S, BsMailbox, 'Contact', 'contact'),
              addStructureItem(S, BsUniversalAccessCircle, 'Toegankelijkheid', 'toegankelijkheid'),
              dataExplainedStructureItem(S),
            ])
        ),
      S.divider(),

      S.listItem()
        .id('PageParts')
        .title('Page parts configuration')
        .icon(BsPuzzle)
        .child(
          S.list()
            .title('Content')
            .items([articlesStructureItem(S), pagePartsStructureItem(S)])
        ),
      S.divider(),
      S.listItem()
        .id('GraphConfigs')
        .title('Graph Configurations')
        .icon(BsBarChart)
        .child(
          S.list()
            .title('Content')
            .items([coronaThermometerStructureItem(S), elementsStructureItem(S, context)])
        ),
      S.divider(),
      lokalizeStructureItem(S, context),
      S.divider(),
    ]);
