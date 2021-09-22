import { Box } from '~/components/base';
import { TeaserItem, TeaserItemProps } from '~/components/teaser-item';
import { VisuallyHidden } from '~/components/visually-hidden';
import { Block, ImageBlock } from '~/types/cms';

export interface WeeklyHighlightProps {
  title: string;
  slug: string;
  summary: Block;
  category: string;
  cover: ImageBlock;
  publicationDate: string;
}

interface HighlightsTileProps {
  hiddenTitle: string;
  weeklyHighlight?: WeeklyHighlightProps;
  highlights: TeaserItemProps[];
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
          <TeaserItem
            title={weeklyHighlight.title}
            slug={weeklyHighlight.slug}
            cover={weeklyHighlight.cover}
            publicationDate={weeklyHighlight.publicationDate}
          />
        )}
        {highlights
          .map((item) => (
            <TeaserItem
              key={item.slug}
              title={item.title}
              slug={item.slug}
              cover={item.cover}
              category={item.category}
            />
          ))
          .slice(0, showWeeklyHighlight ? 1 : 2)}
      </Box>
    </article>
  );
}
