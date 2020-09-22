import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import externalLinks from 'remark-external-links';

// We use lokalise.com as our dictionary/text source and to support internationalisation.
// Lokakise will output JSON files which can be found in `src/locale`.
// However, all content lives inside plain strings. To support structured content and newlines,
// we (optionally) write markdown in Lokakise and parse it to HTML.
const processor = unified()
  .use(markdown)
  .use(externalLinks, {
    target: false,
    rel: ['noopener', 'noreferrer'],
  })
  .use(remark2rehype)
  .use(html);

export function MDToHTMLString(str: string): string {
  return processor.processSync(str).toString();
}
