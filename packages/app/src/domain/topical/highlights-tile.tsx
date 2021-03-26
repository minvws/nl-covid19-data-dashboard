import { Box } from '~/components-styled/base';
import {
  HighlightTeaser,
  HighlightTeaserProps,
} from '~/components-styled/highlight-teaser';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { ArticleBox } from './article-list';
import { Block, ImageBlock } from '~/types/cms';

export interface weeklyHighlightProps {
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
  weeklyHighlight: weeklyHighlightProps;
  highlights: HighlightTeaserProps[];
}

export function HighlightsTile(props: HighlightsTileProps) {
  const { weeklyHighlight, highlights } = props;
  const breakpoints = useBreakpoints();

  return (
    <Box
      display="flex"
      spacingHorizontal={breakpoints.lg}
      flexDirection={{ _: 'row', lg: 'row' }}
      mr={0}
    >
      <ArticleBox>
        <HighlightTeaser
          cover={weeklyHighlight.cover}
          href={`weekberichten/${weeklyHighlight.slug.current}`}
          title={weeklyHighlight.title}
          category={weeklyHighlight.category}
          publicationDate={weeklyHighlight.publicationDate}
          isWeekly
          variant="blue"
        />
      </ArticleBox>
      {highlights.map((item, index) => (
        <ArticleBox key={index}>
          <HighlightTeaser
            cover={item.cover}
            href={item.href}
            label={item.label}
            title={item.title}
            category={item.category}
          />
        </ArticleBox>
      ))}
    </Box>
  );
}
