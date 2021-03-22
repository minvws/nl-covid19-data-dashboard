import ReactMarkdown from 'react-markdown';

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  const isExternalURL = (url: string) => /^https?:\/\//.test(url);

  return (
    <ReactMarkdown
      source={content}
      renderers={{
        link: (props) => (
          <a
            href={props.href}
            rel="noreferrer"
            target={isExternalURL(props.href) ? '_blank' : ''}
          >
            {props.children}
          </a>
        ),
      }}
    />
  );
}
