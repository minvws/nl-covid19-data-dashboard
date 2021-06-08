import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
interface MarkdownProps {
  content: string;
}

interface LinkProps {
  children: ReactNode;
  href: string;
}

const renderers = {
  link: (props: LinkProps) => (
    <a
      href={props.href}
      rel="noreferrer noopener"
      target={isAbsoluteUrl(props.href) ? '_blank' : undefined}
    >
      {props.children}
    </a>
  ),
};

export function Markdown({ content }: MarkdownProps) {
  return <ReactMarkdown source={content} renderers={renderers} />;
}
