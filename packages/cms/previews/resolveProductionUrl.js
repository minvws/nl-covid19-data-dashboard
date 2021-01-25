const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;
export default function resolveProductionUrl(document) {
  return `//localhost:3000/api/preview?secret=${previewSecret}&slug=${document.slug?.current}`;
}
