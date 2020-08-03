import Linkify, { LinkifyProps } from 'linkifyjs/react';

/**
 * Replaces links in a string with linked anchor tags.
 */

const ReplaceLinks: React.FC<IProps> = (props) => {
  const { children, tagName, options } = props;

  return (
    <Linkify tagName={tagName} options={options}>
      {children}
    </Linkify>
  );
};

export type IProps = {
  children: any;
  options?: LinkifyProps['options'];
  tagName?: LinkifyProps['tagName'];
};

export default ReplaceLinks;
