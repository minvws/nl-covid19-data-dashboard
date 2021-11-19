import { StructureBuilder as S } from '@sanity/structure';
import { BsCardChecklist, BsLockFill, BsMap, BsTable } from 'react-icons/bs';
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
  'siteSettings',
  'topicalPage',
  'veelgesteldeVragen',
  'veelgesteldeVragenGroups',
  'faqQuestion',
  'cijferVerantwoording',
  'cijferVerantwoordingGroups',
  'overDitDashboard',
  'overRisicoNiveaus',
  'overRisicoNiveausNew',
  'lockdown',
  'toegankelijkheid',
  'riskLevelNational',
  'lokalizeSubject',
  'lokalizeString',
  'lokalizeText',
  'timeSeries',
  'timelineEvent',
  'contact',
  'cijferVerantwoordingItem',
  'kpi',
  'choropleth',
  'warning',
  'chartConfiguration',
  'kpiConfiguration',
  'pageArticles',
  'pageLinks',
  'pageHighlightedItems',
  'pageRichText',
  'pageIdentifier',
];

export default () =>
  S.list()
    .title('Content')
    .items([
      pagePartListItem(),
      lokalizeListItem(),
      elementsListItem(),
      addListItem(BsLockFill, 'Lockdown', 'lockdown'),
      addListItem(
        GrCircleInformation,
        'Over dit dashboard',
        'overDitDashboard'
      ),
      addListItem(BsMap, 'Over de risiconiveaus', 'overRisicoNiveausNew'),
      S.listItem()
        .title('Veelgestelde vragen')
        .icon(MdQuestionAnswer)
        .child(
          S.list()
            .title('Groepen en Vragen')
            .items([
              addListItem(
                MdQuestionAnswer,
                'Veelgestelde vragen pagina',
                'veelgesteldeVragen'
              ),
              ...S.documentTypeListItems().filter(
                (item) => item.getId() === 'veelgesteldeVragenGroups'
              ),
              ...S.documentTypeListItems().filter(
                (item) => item.getId() === 'faqQuestion'
              ),
            ])
        ),
      S.listItem()
        .title('Cijferverantwoording')
        .icon(BsCardChecklist)
        .child(
          S.list()
            .title('Groepen en Vragen')
            .items([
              addListItem(
                MdQuestionAnswer,
                'CijferVerantwoording pagina',
                'cijferVerantwoording'
              ),
              ...S.documentTypeListItems().filter(
                (item) => item.getId() === 'cijferVerantwoordingGroups'
              ),
              ...S.documentTypeListItems().filter(
                (item) => item.getId() === 'cijferVerantwoordingItem'
              ),
            ])
        ),
      addListItem(
        RiPagesFill,
        'Inschaling risiconiveau nationaal',
        'riskLevelNational'
      ),
      addListItem(GrCircleInformation, 'Toegankelijkheid', 'toegankelijkheid'),
      addListItem(RiPagesFill, 'Contact', 'contact'),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() === 'kpiConfiguration' ||
          item.getId() === 'chartConfiguration'
      ),

      S.divider(),

      S.listItem()
        .title('Pagina onderdelen')
        .icon(BsTable)
        .child(
          S.list()
            .title('Onderdelen')
            .items([
              ...S.documentTypeListItems().filter(
                (item) => item.getId() === 'pageIdentifier'
              ),
              S.divider(),
              ...S.documentTypeListItems().filter((item) =>
                [
                  'pageArticles',
                  'pageLinks',
                  'pageHighlightedItems',
                  'pageRichText',
                ].includes(item.getId() ?? '')
              ),
            ])
        ),

      S.divider(),

      /**
       * Display all document types that haven't been handled in the structure
       * above.
       */
      ...S.documentTypeListItems().filter(
        (item) => !hiddenDocTypes.includes(item.getId() || '')
      ),
    ]);

function addListItem(
  icon: React.FC,
  title: string,
  schemaType: string,
  documentId = schemaType
) {
  return S.listItem()
    .title(title)
    .schemaType(schemaType)
    .icon(icon)
    .child(
      S.editor()
        .title(title)
        .schemaType(schemaType)
        .documentId(documentId)
        .views([S.view.form()])
    );
}
