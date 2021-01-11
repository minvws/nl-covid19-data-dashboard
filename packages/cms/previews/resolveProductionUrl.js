const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;

const rootPages = [
  "overDitDashboard",
  "overRisicoNiveaus",
  "cijferVerantwoording",
  "veelgesteldeVragen",
];

export default function resolveProductionUrl(document) {
  if (rootPages.includes(document._type)) {
    return `//localhost:3000/api/preview/id/${document._id}?secret=${previewSecret}`;
  }

  return null;
}
