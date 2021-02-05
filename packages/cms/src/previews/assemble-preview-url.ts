// Combine base url with page specific options
export function assemblePreviewUrl({
  options,
}: {
  displayed: boolean;
  options: { previewURL: string };
}) {
  const { previewURL } = options;

  if (!previewURL) {
    console.warn('Missing previewURL', { previewURL });
    return '';
  }

  return `${previewURL}`;
}
