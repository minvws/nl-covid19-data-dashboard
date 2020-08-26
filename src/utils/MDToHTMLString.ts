import unified from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import externalLinks from 'remark-external-links';

const processor = unified()
  .use(markdown)
  .use(externalLinks, {
    target: false,
    rel: ['noopener', 'noreferrer'],
  })
  .use(remark2rehype)
  .use(html);

export default function MDToHTMLString(str: string): string {
  return processor.processSync(str).toString();
}
