/**
 * This function generate a GROQ fragment that expands the asset references in a portable text field
 *
 */
export function expandPortableTextAssets(
  name: string,
  parentName: string,
  locale: string
) {
  return `"${name}": [
        ...${parentName}.${name}.${locale}[]
        {
        ...,
        _type == "image" => {
          ...,
          "asset": asset->
        }
      }
    ]`;
}
