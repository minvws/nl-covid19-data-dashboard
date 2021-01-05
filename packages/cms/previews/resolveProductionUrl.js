const previewSecret = "ClBHzTNezfqq2IaF3tLchRemGLTN3qWk"; // Copy the string you used for SANITY_PREVIEW_SECRET
export default function resolveProductionUrl(document) {
  return `//localhost:3000/api/preview?secret=${previewSecret}&slug=${document.slug.current}`;
}
