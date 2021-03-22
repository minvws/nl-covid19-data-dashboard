import unified from 'unified';
import parse from 'remark-parse';
import remark2react from 'remark-react';
import externalLinks from 'remark-external-links';
import styled from 'styled-components';
import { ReactNode } from 'react';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const parsedMarkdown = unified()
    .use(parse)
    .use(externalLinks, {
      target: '_blank',
      rel: ['noopener', 'noreferrer'],
    })
    .use(remark2react)
    .processSync(content).result;

  return <MarkdownStyles>{parsedMarkdown as ReactNode}</MarkdownStyles>;
}
const MarkdownStyles = styled.div({
  'p:last-of-type': {
    marginBottom: 0,
  },
});
