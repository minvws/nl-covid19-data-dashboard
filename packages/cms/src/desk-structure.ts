import { StructureBuilder as S } from '@sanity/structure';
// import S from '@sanity/desk-tool/structure-S';
import { BsCardChecklist, BsLockFill, BsMap, BsTable } from 'react-icons/bs';
import { GrCircleInformation, GrDashboard } from 'react-icons/gr';
import { MdQuestionAnswer } from 'react-icons/md';
import { RiPagesFill } from 'react-icons/ri';
import 'sanity-mobile-preview/dist/index.css?raw';

// Build up the root of the preview URL
// const remoteURL = procesS.env.SANITY_STUDIO_PREVIEW_SERVER;
// const localURL = "http://localhost:3000";
// const previewURL =
//   window.location.hostname === "localhost" ? localURL : remoteURL;

// const WebPreview = ({ options, displayed }) => {
//   const url = assemblePreviewUrl({ displayed, options });

//   return (
//     <iframe
//       style={{
//         margin: 0,
//         padding: 0,
//       }}
//       width="100%"
//       height="99%"
//       src={url}
//       frameBorder={0}
//     />
//   );
// };

// const IFrameMobilePreview = ({ options, displayed }) => {
//   const url = assemblePreviewUrl({ displayed, options });

//   return (
//     <SanityMobilePreview>
//       <iframe src={url} frameBorder={0} width="100%" height="100%" />
//     </SanityMobilePreview>
//   );
// };

// hiddenDocTypes will filter out all of the content models
// we expose through other sections in the CMS.
// for example, we will show categories through a custom panel
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
  'lokalizeString',
  'lokalizeText',
];

export default () =>
  S.list()
    .title('Content')
    .items([
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

      // Add a visual divider (optional)
      S.divider(),

      // This returns an array of all the document types
      // defined in schema.jS. We filter out those that we have
      // defined the structure above
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
