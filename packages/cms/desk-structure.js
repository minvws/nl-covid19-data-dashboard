import React from "react";
import SanityMobilePreview from "sanity-mobile-preview";
import "sanity-mobile-preview/dist/index.css?raw";

import S from "@sanity/desk-tool/structure-builder";
import { GoSettings } from "react-icons/go";

import { MdQuestionAnswer } from "react-icons/md";

import { BsCardChecklist, BsMap } from "react-icons/bs";
import { GrCircleInformation } from "react-icons/gr";

import ColorblindPreview from "./previews/colorblind-filter/ColorblindPreview";
import { assemblePreviewUrl } from "./previews/assemblePreviewUrl";

// Build up the root of the preview URL
// const remoteURL = process.env.SANITY_STUDIO_PREVIEW_SERVER;
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
const hiddenDocTypes = (listItem) =>
  ![
    // "route",
    // "navigationMenu",
    // "post",
    "siteSettings",
    // "author",
    // "category",
    // "laatsteOntwikkelingen",
    // "tile",
    "veelgesteldeVragen",
    "cijferVerantwoording",
    "overDitDashboard",
    "overRisicoNiveaus",
  ].includes(listItem.getId());

export default () =>
  S.list()
    .title("Content")
    .items([
      // S.listItem()
      //   .title("Instellingen")
      //   .schemaType("siteSettings")
      //   .icon(GoSettings)
      //   .child(
      //     S.editor()
      //       .schemaType("siteSettings")
      //       .title("Site instellingen")
      //       .documentId("siteSettings")
      //   ),

      S.listItem()
        .title("Over dit dashboard")
        .schemaType("overDitDashboard")
        .icon(GrCircleInformation)
        .child(
          S.editor()
            .title("Over dit dashboard")
            .schemaType("overDitDashboard")
            .documentId("overDitDashboard")
            .views([
              S.view.form(),
              // S.view
              //   .component(WebPreview)
              //   .options({ previewURL: `${previewURL}/over` })
              //   .title("Web"),
              // S.view
              //   .component(IFrameMobilePreview)
              //   .options({ previewURL: `${previewURL}/over` })
              //   .title("Mobile"),
              // S.view
              //   .component(ColorblindPreview)
              //   .options({ previewURL: `${previewURL}/over` })
              //   .title("Color Blindness"),
            ])
        ),

      S.listItem()
        .title("Over de risiconiveaus")
        .schemaType("overRisicoNiveaus")
        .icon(BsMap)
        .child(
          S.editor()
            .title("Over de risiconiveaus")
            .schemaType("overRisicoNiveaus")
            .documentId("overRisicoNiveaus")
            .views([
              S.view.form(),
              // S.view
              //   .component(WebPreview)
              //   .options({ previewURL: `${previewURL}/over-risiconiveaus` })
              //   .title("Web"),
              // S.view
              //   .component(IFrameMobilePreview)
              //   .options({ previewURL: `${previewURL}/over-risiconiveaus` })
              //   .title("Mobile"),
              // S.view
              //   .component(ColorblindPreview)
              //   .options({ previewURL: `${previewURL}/over-risiconiveaus` })
              //   .title("Color Blindness"),
            ])
        ),

      S.listItem()
        .title("Veelgestelde vragen")
        .schemaType("veelgesteldeVragen")
        .icon(MdQuestionAnswer)
        .child(
          S.editor()
            .title("Veelgestelde vragen")
            .schemaType("veelgesteldeVragen")
            .documentId("veelgesteldeVragen")
            .views([
              S.view.form(),
              // S.view
              //   .component(WebPreview)
              //   .options({ previewURL: `${previewURL}/veelgestelde-vragen` })
              //   .title("Web"),
              // S.view
              //   .component(IFrameMobilePreview)
              //   .options({ previewURL: `${previewURL}/veelgestelde-vragen` })
              //   .title("Mobile"),
              // S.view
              //   .component(ColorblindPreview)
              //   .options({ previewURL: `${previewURL}/veelgestelde-vragen` })
              //   .title("Color Blindness"),
            ])
        ),

      S.listItem()
        .title("Cijferverantwoording")
        .schemaType("cijferVerantwoording")
        .icon(BsCardChecklist)
        .child(
          S.editor()
            .title("Cijferverantwoording")
            .schemaType("cijferVerantwoording")
            .documentId("cijferVerantwoording")
            .views([
              S.view.form(),
              // S.view
              //   .component(WebPreview)
              //   .title("Web")
              //   .options({ previewURL: `${previewURL}/verantwoording` }),
              // S.view
              //   .component(IFrameMobilePreview)
              //   .options({ previewURL: `${previewURL}/verantwoording` })
              //   .title("Mobile"),
              // S.view
              //   .component(ColorblindPreview)
              //   .options({ previewURL: `${previewURL}/verantwoording` })
              //   .title("Color Blindness"),
            ])
        ),

      // Add a visual divider (optional)
      S.divider(),

      // This returns an array of all the document types
      // defined in schema.js. We filter out those that we have
      // defined the structure above
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
