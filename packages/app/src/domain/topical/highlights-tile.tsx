import { ArticleSummary } from '~/components/article-teaser';
import { Box } from '~/components/base';
import { ContentTeaser } from '~/components/content-teaser';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Block, ImageBlock } from '~/types/cms';

export interface WeeklyHighlightProps {
  title: string;
  slug: { current: string };
  summary: Block;
  category: string;
  cover: ImageBlock;
  publicationDate: string;
}

interface HighlightsTileProps {
  hiddenTitle: string;
  weeklyHighlight?: WeeklyHighlightProps;
  highlights: ArticleSummary[];
  showWeeklyHighlight: boolean;
}

export function HighlightsTile({
  hiddenTitle,
  weeklyHighlight,
  highlights,
  showWeeklyHighlight,
}: HighlightsTileProps) {
  return (
    <article>
      <VisuallyHidden>
        <h2>{hiddenTitle}</h2>
      </VisuallyHidden>

      <Box
        display="flex"
        flexDirection={{ _: 'column', md: 'row' }}
        spacing={{ _: 4, md: 0 }}
      >
        {showWeeklyHighlight && weeklyHighlight && (
          <ContentTeaser
            title={weeklyHighlight.title}
            slug={weeklyHighlight.slug.current}
            cover={weeklyHighlight.cover}
            publicationDate={weeklyHighlight.publicationDate}
            isWeeklyHighlight
          />
        )}
        {highlights
          .map((item) => (
            <ContentTeaser
              key={item.slug.current}
              title={item.title}
              slug={item.slug.current}
              cover={item.cover}
              category={item.category}
            />
          ))
          .slice(0, showWeeklyHighlight ? 1 : 2)}
      </Box>
    </article>
  );
}
