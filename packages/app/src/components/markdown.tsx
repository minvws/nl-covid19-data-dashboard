import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { ExternalLink } from '~/components/external-link';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
import { Link } from '~/utils/link';
import { DisplayOnMatchingQueryCode } from './display-on-matching-query-code';
import { Message } from './message';

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

  /**
   * The code element is hijacked to display context-aware pieces of content.
   * usage:
   *
   *     ```VR09,VR16
   *     This will only be displayed on routes with a code equal to VR09 or VR16.
   *     ````
   */
  code: ({ language = '', value }: { language: string; value: string }) => (
    <DisplayOnMatchingQueryCode code={language}>
      <Markdown content={value} />
    </DisplayOnMatchingQueryCode>
  ),

  /**
   * The blockquote element is hijacked for displaying "warning" messages.
   */
  blockquote: (props: any) => {
    return <Message variant="warning">{props.children}</Message>;
  },
};

export function Markdown({ content }: MarkdownProps) {
  return <ReactMarkdown source={content} renderers={renderers} />;
}
