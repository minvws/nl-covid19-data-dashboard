// Combine base url with page specific options
export const assemblePreviewUrl = ({ displayed, options }) => {
  const { previewURL } = options;
  if (!previewURL) {
    console.warn("Missing previewURL", { previewURL });
    return "";
  }
  return `${previewURL}`;
};
