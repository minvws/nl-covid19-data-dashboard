import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  content: string;
}

interface LinkProp {
  children: ReactNode[];
  href: string;
}

const isExternalURL = (url: string) => /^https?:\/\//.test(url);

const renderers = {
  link: (props: LinkProp) => (
    <a
      href={props.href}
      rel="noreferrer"
      target={isExternalURL(props.href) ? '_blank' : ''}
    >
      {props.children}
    </a>
  ),
};

export function Markdown({ content }: MarkdownProps) {
  return <ReactMarkdown source={content} renderers={renderers} />;
}
