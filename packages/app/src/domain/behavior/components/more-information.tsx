import { AnchorTile } from '~/components/anchor-tile';
import { Text } from '~/components/typography';
import { useIntl } from '~/intl';

export function MoreInformation() {
  const { siteText } = useIntl();
  const behaviorPageText =
    siteText.pages.behaviorPage.shared.meer_onderzoeksresultaten;
  return (
    <AnchorTile
      title={behaviorPageText.title}
      href={behaviorPageText.linkHref}
      label={behaviorPageText.linkLabel}
      external
    >
      <Text>{behaviorPageText.description}</Text>
    </AnchorTile>
  );
}
