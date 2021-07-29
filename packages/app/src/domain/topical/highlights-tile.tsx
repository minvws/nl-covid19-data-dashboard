import { Box } from '~/components/base';
import {
  HighlightTeaser,
  HighlightTeaserProps,
} from '~/components/highlight-teaser';
import { Block, ImageBlock } from '~/types/cms';
import { ArticleBox } from './article-list';

export interface WeeklyHighlightProps {
  title: string;
  slug: {
    current: string;
  };
  summary: Block;
  category: string;
  cover: ImageBlock;
  publicationDate: string;
}

interface HighlightsTileProps {
  weeklyHighlight: WeeklyHighlightProps;
  highlights: HighlightTeaserProps[];
  showWeeklyHighlight: boolean;
}

export function HighlightsTile(props: HighlightsTileProps) {
  const { weeklyHighlight, highlights, showWeeklyHighlight } = props;

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', xs: 'row' }}
      flexWrap="wrap"
      spacing={4}
    >
      {showWeeklyHighlight && (
        <ArticleBox>
          <HighlightTeaser
            cover={weeklyHighlight.cover}
            href={`/weekberichten/${weeklyHighlight.slug.current}`}
            title={weeklyHighlight.title}
            category={weeklyHighlight.category}
            publicationDate={weeklyHighlight.publicationDate}
            isWeekly
            variant="blue"
          />
        </ArticleBox>
      )}
      {highlights
        .map((item, index) => (
          <ArticleBox key={index}>
            <HighlightTeaser
              cover={item.cover}
              href={item.href}
              label={item.label}
              title={item.title}
              category={item.category}
            />
          </ArticleBox>
        ))
        .slice(0, showWeeklyHighlight ? 2 : 3)}
    </Box>
  );
}
