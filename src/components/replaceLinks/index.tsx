import Linkify, { LinkifyProps } from 'linkifyjs/react';
import { WithChildren } from 'types';

/**
 * Replaces links in a string with linked anchor tags.
 */

function ReplaceLinks(props: IProps, { children }: WithChildren) {
  const { tagName, options } = props;

  return (
    <Linkify tagName={tagName} options={options}>
      {children}
    </Linkify>
  );
}

export type IProps = {
  children: string;
  options?: LinkifyProps['options'];
  tagName?: LinkifyProps['tagName'];
};

export default ReplaceLinks;
