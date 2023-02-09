import { StructureBuilder as S } from '@sanity/structure';
import { BsCardChecklist, BsCardList, BsFillFileBarGraphFill, BsFillPuzzleFill, BsMap, BsHouseFill, BsThermometer, BsGearFill } from 'react-icons/bs';
import { GrCircleInformation } from 'react-icons/gr';
import { MdQuestionAnswer } from 'react-icons/md';
import { RiPagesFill } from 'react-icons/ri';
import 'sanity-mobile-preview/dist/index.css?raw';
import { elementsListItem } from './elements/elements-list-item';
import { lokalizeListItem } from './lokalize/lokalize-list-item';
import { pagePartListItem } from './page/page-part-list-item';

/**
 * This is a list of doc types we handle in the custom menu structure. All
 * others will appear automatically at the bottom.
 */
const hiddenDocTypes = [
  'ageDemographicChartConfiguration',
  'chartConfiguration',
  'choropleth',
  'choroplethConfiguration',
  'cijferVerantwoording',
  'cijferVerantwoordingGroups',
  'cijferVerantwoordingItem',
  'contact',
  'donutChartConfiguration',
  'faqQuestion',
  'kpi',
  'kpiConfiguration',
  'measures',
  'lokalizeString',
  'lokalizeSubject',
  'lokalizeText',
  'measureTheme',
  'measureTile',
  'measureTileCollection',
  'overDitDashboard',
  'overRisicoNiveaus',
  'overRisicoNiveausNew',
  'pageArticles',
  'pageHighlightedItems',
  'pageIdentifier',
  'pageLinks',
  'pageRichText',
  'siteSettings',
  'theme',
  'themeCollection',
  'themeLink',
  'themeLinkCollection',
  'themeTile',
  'themeTileCollection',
  'thermometer',
  'thermometerLevel',
  'thermometerTimeline',
  'thermometerTimelineEvent',
  'timelineEvent',
  'timeSeries',
  'toegankelijkheid',
  'topicalPage',
  'topicalPageConfig',
  'trendIcon',
  'themeTileDateConfig',
  'veelgesteldeVragen',
  'veelgesteldeVragenGroups',
  'warning',
];

export default () =>
  S.list()
    .id('content')
    .title('Content')
    .items([
      pagePartListItem(),
      lokalizeListItem(),
      elementsListItem(),
      addListItem(BsCardChecklist, 'Maatregelen', 'measures'),
      addListItem(GrCircleInformation, 'Over dit dashboard', 'overDitDashboard'),
      addListItem(BsMap, 'Over de risiconiveaus', 'overRisicoNiveausNew'),
      S.listItem()
        .id('veelgestelde-vragen')
        .title('Veelgestelde vragen')
        .icon(MdQuestionAnswer)
        .child(
          S.list()
            .title('Groepen en Vragen')
            .items([
              addListItem(MdQuestionAnswer, 'Veelgestelde vragen pagina', 'veelgesteldeVragen'),
              ...S.documentTypeListItems().filter((item) => item.getId() === 'veelgesteldeVragenGroups'),
              ...S.documentTypeListItems().filter((item) => item.getId() === 'faqQuestion'),
            ])
        ),
      S.listItem()
        .id('cijferverantwoording')
        .title('Cijferverantwoording')
        .icon(BsCardList)
        .child(
          S.list()
            .title('Groepen en Vragen')
            .items([
              addListItem(MdQuestionAnswer, 'CijferVerantwoording pagina', 'cijferVerantwoording'),
              ...S.documentTypeListItems().filter((item) => item.getId() === 'cijferVerantwoordingGroups'),
              ...S.documentTypeListItems().filter((item) => item.getId() === 'cijferVerantwoordingItem'),
            ])
        ),
      addListItem(GrCircleInformation, 'Toegankelijkheid', 'toegankelijkheid'),
      addListItem(RiPagesFill, 'Contact', 'contact'),

      S.divider(),

      S.listItem()
        .id('grafieken')
        .title('Grafieken')
        .icon(BsFillFileBarGraphFill)
        .child(
          S.list()
            .title('Configuraties')
            .items(
              S.documentTypeListItems().filter((item) =>
                ['kpiConfiguration', 'chartConfiguration', 'ageDemographicChartConfiguration', 'donutChartConfiguration', 'choroplethConfiguration'].includes(item.getId() ?? '')
              )
            )
        ),

      S.listItem()
        .id('pagina-onderdelen')
        .title('Pagina onderdelen')
        .icon(BsFillPuzzleFill)
        .child(
          S.list()
            .title("Pagina's en onderdelen")
            .items([
              ...S.documentTypeListItems().filter((item) => item.getId() === 'pageIdentifier'),
              S.divider(),
              ...S.documentTypeListItems().filter((item) => ['pageArticles', 'pageLinks', 'pageHighlightedItems', 'pageRichText'].includes(item.getId() ?? '')),
            ])
        ),

      S.divider(),

      S.listItem()
        .id('topicalPage')
        .title('Samenvattingspagina')
        .icon(BsHouseFill)
        .child(
          S.list()
            .title('Pagina configuratie')
            .items([
              addListItem(BsGearFill, 'Samenvattingspagina configuratie', 'topicalPageConfig'),
              addListItem(BsGearFill, 'Weeksamenvatting', 'weeklySummary'),
              addListItem(BsThermometer, 'Thermometer', 'thermometer'),
              addListItem(BsGearFill, "KPI thema's", 'themeCollection'),
              addListItem(BsGearFill, 'Advies thema', 'measureTheme'),
            ])
        ),

      S.divider(),

      /**
       * Display all document types that haven't been handled in the structure
       * above.
       */
      ...S.documentTypeListItems().filter((item) => !hiddenDocTypes.includes(item.getId() || '')),
    ]);

function addListItem(icon: React.FC, title: string, schemaType: string, documentId = schemaType) {
  return S.listItem()
    .id(schemaType)
    .title(title)
    .schemaType(schemaType)
    .icon(icon)
    .child((id) => S.editor().id(id).title(title).schemaType(schemaType).documentId(documentId).views([S.view.form()]));
}
