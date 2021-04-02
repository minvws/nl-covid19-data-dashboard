import { StructureBuilder as S } from '@sanity/structure';
import { BsCardChecklist, BsLockFill, BsMap, BsTable } from 'react-icons/bs';
import { FaLanguage } from 'react-icons/fa';
import { GrCircleInformation, GrDashboard } from 'react-icons/gr';
import { MdQuestionAnswer } from 'react-icons/md';
import { RiPagesFill } from 'react-icons/ri';
import 'sanity-mobile-preview/dist/index.css?raw';

/**
 * This is a list of doc types we handle in the custom menu structure. All
 * others will appear automatically at the bottom.
 */
const hiddenDocTypes = [
  'siteSettings',
  'topicalPage',
  'veelgesteldeVragen',
  'veelgesteldeVragenGroups',
  'cijferVerantwoording',
  'overDitDashboard',
  'overRisicoNiveaus',
  'roadmap',
  'lockdown',
  'behaviorPage',
  'deceasedPage',
  'hospitalPage',
  'intensiveCarePage',
  'positiveTestsPage',
  'reproductionPage',
  'sewerPage',
  'vaccinationsPage',
  'toegankelijkheid',
  'escalationLevelPage',
  'lokalizeSubject',
  'lokalizeString',
  'lokalizeText',
];

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Lokalize')
        .icon(FaLanguage)
        .child(
          S.documentTypeList('lokalizeSubject')
            .title('Keys')
            .child(S.editor().views([S.view.form()]))
        ),
      S.listItem()
        .title('Lockdown en Routekaart')
        .icon(BsTable)
        .child(
          S.list()
            .title('Lockdown en Routekaart')
            .items([
              addListItem(BsLockFill, 'Lockdown', 'lockdown'),
              addListItem(BsTable, 'Routekaart', 'roadmap'),
            ])
        ),
      addListItem(
        GrCircleInformation,
        'Over dit dashboard',
        'overDitDashboard'
      ),
      addListItem(GrDashboard, 'Actueel', 'topicalPage'),
      addListItem(BsMap, 'Over de risiconiveaus', 'overRisicoNiveaus'),
      S.listItem()
        .title('Veelgestelde vragen')
        .icon(MdQuestionAnswer)
        .child(
          S.list()
            .title('Groepen en Vragen')
            .items([
              ...S.documentTypeListItems().filter(
                (item) => item.getId() === 'veelgesteldeVragenGroups'
              ),
              addListItem(
                MdQuestionAnswer,
                'Veelgestelde vragen',
                'veelgesteldeVragen'
              ),
            ])
        ),
      addListItem(
        BsCardChecklist,
        'Cijferverantwoording',
        'cijferVerantwoording'
      ),
      addListItem(
        RiPagesFill,
        'Inschaling risiconiveau',
        'escalationLevelPage'
      ),
      addListItem(RiPagesFill, 'Sterfte', 'deceasedPage'),
      addListItem(RiPagesFill, 'Gedrag en naleving', 'behaviorPage'),
      addListItem(RiPagesFill, 'Ziekenhuis opnames', 'hospitalPage'),
      addListItem(RiPagesFill, 'IC opnames', 'intensiveCarePage'),
      addListItem(RiPagesFill, 'Positieve testen', 'positiveTestsPage'),
      addListItem(RiPagesFill, 'Reproductiegetal', 'reproductionPage'),
      addListItem(RiPagesFill, 'Rioolwater', 'sewerPage'),
      addListItem(RiPagesFill, 'Vaccinaties', 'vaccinationsPage'),
      addListItem(GrCircleInformation, 'Toegankelijkheid', 'toegankelijkheid'),

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
