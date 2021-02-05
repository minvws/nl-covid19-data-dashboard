const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;

interface IncompleteDocument {
  slug?: { current: string };
}

export default function resolveProductionUrl(document: IncompleteDocument) {
  return `//localhost:3000/api/preview?secret=${previewSecret}&slug=${document.slug?.current}`;
}
