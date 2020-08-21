import Linkify, { LinkifyProps } from 'linkifyjs/react';

/**
 * Replaces links in a string with linked anchor tags.
 */

const ReplaceLinks: React.FC<IProps> = (props) => {
  const { children, tagName } = props;

  const options = {
    ...props?.options,
    attributes: { rel: 'noopener noreferrer', ...props?.options?.attributes },
  };

  return (
    <Linkify tagName={tagName} options={options}>
      {children}
    </Linkify>
  );
};

export type IProps = {
  children: string;
  options?: LinkifyProps['options'];
  tagName?: LinkifyProps['tagName'];
};

export default ReplaceLinks;
