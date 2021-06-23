import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink } from '~/components/external-link';
import { Link } from '~/utils/link';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
interface MarkdownProps {
  content: string;
}
interface LinkProps {
  children: ReactNode;
  href: string;
}

const renderers = {
  link: (props: LinkProps) =>
    isAbsoluteUrl(props.href) ? (
      <ExternalLink href={props.href}>{props.children}</ExternalLink>
    ) : (
      <Link href={props.href} passHref>
        <a>{props.children}</a>
      </Link>
    ),
};

export function Markdown({ content }: MarkdownProps) {
  return <ReactMarkdown source={content} renderers={renderers} />;
}
