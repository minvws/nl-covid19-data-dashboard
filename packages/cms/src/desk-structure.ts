import { StructureBuilder } from '@sanity/structure';
import { ReactNode } from 'react';
// import StructureBuilder from '@sanity/desk-tool/structure-builder';
import { BsCardChecklist, BsLockFill, BsMap, BsTable } from 'react-icons/bs';
import { GrCircleInformation, GrDashboard } from 'react-icons/gr';
import { MdQuestionAnswer } from 'react-icons/md';
import { RiPagesFill } from 'react-icons/ri';
import 'sanity-mobile-preview/dist/index.css?raw';

// Build up the root of the preview URL
// const remoteURL = procesStructureBuilder.env.SANITY_STUDIO_PREVIEW_SERVER;
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
];

export default () =>
  StructureBuilder.list()
    .title('Content')
    .items([
      StructureBuilder.listItem()
        .title('Lockdown en Routekaart')
        .icon(BsTable)
        .child(
          StructureBuilder.list()
            .title('Lockdown en Routekaart')
            .items([
              addListItem(StructureBuilder, BsLockFill, 'Lockdown', 'lockdown'),
              addListItem(StructureBuilder, BsTable, 'Routekaart', 'roadmap'),
            ])
        ),
      addListItem(
        StructureBuilder,
        GrCircleInformation,
        'Over dit dashboard',
        'overDitDashboard'
      ),
      addListItem(StructureBuilder, GrDashboard, 'Actueel', 'topicalPage'),
      addListItem(
        StructureBuilder,
        BsMap,
        'Over de risiconiveaus',
        'overRisicoNiveaus'
      ),
      addListItem(
        StructureBuilder,
        MdQuestionAnswer,
        'Veelgestelde vragen',
        'veelgesteldeVragen'
      ),
      addListItem(
        StructureBuilder,
        BsCardChecklist,
        'Cijferverantwoording',
        'cijferVerantwoording'
      ),
      addListItem(
        StructureBuilder,
        RiPagesFill,
        'Inschaling risiconiveau',
        'escalationLevelPage'
      ),
      addListItem(StructureBuilder, RiPagesFill, 'Sterfte', 'deceasedPage'),
      addListItem(
        StructureBuilder,
        RiPagesFill,
        'Gedrag en naleving',
        'behaviorPage'
      ),
      addListItem(
        StructureBuilder,
        RiPagesFill,
        'Ziekenhuis opnames',
        'hospitalPage'
      ),
      addListItem(
        StructureBuilder,
        RiPagesFill,
        'IC opnames',
        'intensiveCarePage'
      ),
      addListItem(
        StructureBuilder,
        RiPagesFill,
        'Positieve testen',
        'positiveTestsPage'
      ),
      addListItem(
        StructureBuilder,
        RiPagesFill,
        'Reproductiegetal',
        'reproductionPage'
      ),
      addListItem(StructureBuilder, RiPagesFill, 'Rioolwater', 'sewerPage'),
      addListItem(
        StructureBuilder,
        RiPagesFill,
        'Vaccinaties',
        'vaccinationsPage'
      ),
      addListItem(
        StructureBuilder,
        GrCircleInformation,
        'Toegankelijkheid',
        'toegankelijkheid'
      ),

      // Add a visual divider (optional)
      StructureBuilder.divider(),

      // This returns an array of all the document types
      // defined in schema.jStructureBuilder. We filter out those that we have
      // defined the structure above
      ...StructureBuilder.documentTypeListItems().filter(
        (item) => !hiddenDocTypes.includes(item.getId() || '')
      ),
    ]);

function addListItem(
  builder: typeof StructureBuilder,
  icon: React.FC,
  title: string,
  schemaType: string,
  documentId = schemaType
) {
  return builder
    .listItem()
    .title(title)
    .schemaType(schemaType)
    .icon(icon)
    .child(
      StructureBuilder.editor()
        .title(title)
        .schemaType(schemaType)
        .documentId(documentId)
        .views([builder.view.form()])
    );
}
