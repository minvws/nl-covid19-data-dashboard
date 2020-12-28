import { AnchorTile } from '~/components-styled/anchor-tile';
import { Text } from '~/components-styled/typography';
import siteText from '~/locale/index';

const text = siteText.gedrag_common.meer_onderzoeksresultaten;

export function MoreInformation() {
  return (
    <AnchorTile
      title={text.title}
      href={text.linkHref}
      label={text.linkLabel}
      external
    >
      <Text>{text.description}</Text>
    </AnchorTile>
  );
}
