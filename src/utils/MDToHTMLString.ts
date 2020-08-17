// @ts-ignore
import snarkdown from 'snarkdown';
// @ts-ignore
import createDOMPurify from 'dompurify';
// @ts-ignore
import { JSDOM } from 'jsdom';

import replaceVariablesInText from 'utils/replaceVariablesInText';

export default function MDToHTMLString(str: string): string {
  const strWithNewlines = replaceVariablesInText(str, {
    whitespace: '\n\n \n\n',
  });
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);

  return DOMPurify.sanitize(snarkdown(strWithNewlines));
}
