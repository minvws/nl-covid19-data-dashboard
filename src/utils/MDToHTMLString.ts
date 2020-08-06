// @ts-ignore
import snarkdown from 'snarkdown';

import replaceVariablesInText from 'utils/replaceVariablesInText';

// We use lokalise.com as our dictionary/text source and to support internationalisation.
// Lokakise will output JSON files which can be found in `src/locale`.
// However, all content lives inside plain strings. To support structured content and newlines,
// we (optionally) write markdown in Lokakise and parse it to HTML.
export default function MDToHTMLString(str: string): string {
  const strWithNewlines = replaceVariablesInText(str, {
    whitespace: '\n\n \n\n',
  });

  return snarkdown(strWithNewlines);
}
