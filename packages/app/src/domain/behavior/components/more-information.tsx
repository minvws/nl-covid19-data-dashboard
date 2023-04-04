import { AnchorTile } from '~/components/anchor-tile';
import { Text } from '~/components/typography';
import { SiteText } from '~/locale';

interface MoreInformationProps {
  text: SiteText['pages']['behavior_page']['shared']['meer_onderzoeksresultaten'];
}

export function MoreInformation({ text }: MoreInformationProps) {
  return (
    <AnchorTile
      title={text.title}
      href={text.link_href}
      label={text.link_label}
      external
    >
      <Text>{text.description}</Text>
    </AnchorTile>
  );
}
