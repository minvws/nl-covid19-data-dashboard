import Linkify, { LinkifyProps } from 'linkifyjs/react';

export default ReplaceLinks;

export type ReplaceLinksProps = {
  children: React.ReactNode;
  options: LinkifyProps['options'];
  tagName: LinkifyProps['tagName'];
};

/**
 * Replaces links in a string with linked anchor tags.
 */
function ReplaceLinks(props: ReplaceLinksProps): JSX.Element {
  const { children, tagName, options } = props;

  return (
    <Linkify tagName={tagName} options={options}>
      {children}
    </Linkify>
  );
}
