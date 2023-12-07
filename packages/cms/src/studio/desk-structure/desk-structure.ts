import { addStructureItem } from '../utils';
import { articlesStructureItem } from './articles-structure-item';
import { BsInfoCircle, BsMailbox, BsUniversalAccessCircle, BsBarChart } from 'react-icons/bs';
import { coronaThermometerStructureItem } from './corona-thermometer-structure-item';
import { dataExplainedStructureItem } from './data-explained-structure-item';
import { elementsStructureItem } from './elements-structure-item';
import { faqStructureItem } from './faq-structure-item';
import { homepageStructureItem } from './homepage-structure-item';
import { lokalizeStructureItem } from './lokalize-structure-item';
import { notFoundPageStructureItem } from './not-found-page-structure-item';
import { pagePartsStructureItem } from './page-parts-structure-item';
import { pagesStructureItem } from './pages-structure-item';
import { StructureBuilder, StructureResolverContext } from 'sanity/desk';

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
        .title("Dashboard content pagina's")
        .child(
          S.list()
            .title("Pagina's")
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

      pagePartsStructureItem(S),

      S.divider(),

      S.listItem()
        .id('GraphConfigs')
        .title('Visuals configuratie')
        .icon(BsBarChart)
        .child(
          S.list()
            .title('Configuratie')
            .items([coronaThermometerStructureItem(S), elementsStructureItem(S, context)])
        ),
      S.divider(),
      lokalizeStructureItem(S, context),
      S.divider(),
      articlesStructureItem(S),
      S.divider(),
    ]);
