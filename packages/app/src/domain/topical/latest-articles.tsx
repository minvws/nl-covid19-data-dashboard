import { ArticleSummary } from '~/components-styled/article-summary';
import { Tile } from '~/components-styled/tile';
import { Heading } from '~/components-styled/typography';
import siteText from '~/locale';
import { Article } from '~/types/cms';

type LatestArticlesProps = {
  articles: Article[];
};

export function LatestArticles({ articles }: LatestArticlesProps) {
  console.dir(articles);

  return (
    <Tile>
      <Heading level={2}>
        {siteText.nationaal_actueel.latest_articles.title}
      </Heading>
      {articles.map((x) => (
        <ArticleSummary
          slug={x.slug.current}
          title={x.title}
          summary={x.intro}
          coverImageSrc={x.cover?.asset?._ref}
        />
      ))}
    </Tile>
  );
}
