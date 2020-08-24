import unified from 'unified';
// import remark from 'remark';
import markdown from 'remark-parse';
import rehype from 'remark-rehype';
import html from 'rehype-stringify';
// import externalLinks from 'remark-external-links';

export default function MDToHTMLString(str: string): string {
  const processor = unified().use(markdown).use(rehype).use(html);
  // const replaceLinks = remark()
  //   .use(externalLinks, {
  //     target: false,
  //     rel: ['noopener', 'noreferrer'],
  //   })
  //   .use(html)
  //   .process(str, function (err, file) {
  //     if (err) throw err;
  //     console.log(String(file));
  //   });

  const output = processor.processSync(str).toString();

  return output;
}
