// @ts-ignore
import snarkdown from 'snarkdown';

// We use lokalise.com as our dictionary/text source and to support internationalisation.
// Lokakise will output JSON files which can be found in `src/locale`.
// However, all content lives inside plain strings. To support structured content and newlines,
// we (optionally) write markdown in Lokakise and parse it to HTML.
export default function MDToHTMLString(str: string): string {
  // To achieve the visual whitespace we want when adding a new line,
  // we need to write a lot of `<br>` or `\n`. To make the writing experience more pleasant,
  // writing a single `\n` will be replaced with the amount of newlines we need for the whitespace effect.
  return snarkdown(str.replace(/(\n)+/g, '\n\n \n\n'));
}
