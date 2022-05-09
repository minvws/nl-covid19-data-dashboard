import { AnchorTile } from '~/components/anchor-tile';
import { Text } from '~/components/typography';
import { SiteText } from '~/locale';

interface MoreInformationProps {
  text: SiteText['pages']['behaviorPage']['shared']['meer_onderzoeksresultaten'];
}

export function MoreInformation({ text }: MoreInformationProps) {
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
