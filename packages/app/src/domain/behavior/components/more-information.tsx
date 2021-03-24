import { AnchorTile } from '~/components-styled/anchor-tile';
import { Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';

export function MoreInformation() {
  const { siteText } = useIntl();
  const text = siteText.gedrag_common.meer_onderzoeksresultaten;
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
