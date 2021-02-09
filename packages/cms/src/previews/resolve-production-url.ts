const previewSecret = process.env.SANITY_STUDIO_PREVIEW_SECRET;

/**
 * The interface `IncompleteDocument` is "incomplete" because I've only added
 * the `slug?.current` type and there's probably a lot more to type ..
 */
interface IncompleteDocument {
  slug?: { current: string };
}

export default function resolveProductionUrl(document: IncompleteDocument) {
  return `//localhost:3000/api/preview?secret=${previewSecret}&slug=${document.slug?.current}`;
}
