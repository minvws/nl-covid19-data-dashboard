import { Tile } from '~/components-styled/tile';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale';

export function LatestArticles() {
  return (
    <Tile>
      <Heading level={2}>
        {siteText.nationaal_actueel.latest_articles.title}
      </Heading>
    </Tile>
  );
}
