import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  content: string;
}

interface LinkProps {
  children: ReactNode;
  href: string;
}

const isExternalURL = (url: string) => /^https?:\/\//.test(url);

const renderers = {
  link: (props: LinkProps) => (
    <a
      href={props.href}
      rel="noreferrer noopener"
      target={isExternalURL(props.href) ? '_blank' : undefined}
    >
      {props.children}
    </a>
  ),
};

export function Markdown({ content }: MarkdownProps) {
  return <ReactMarkdown source={content} renderers={renderers} />;
}
