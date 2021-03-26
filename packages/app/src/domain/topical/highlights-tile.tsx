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
      spacing={3}
      flexDirection={{ _: 'row', lg: 'row' }}
    >
      <ArticleBox>
        <HighlightTeaser
          cover={weeklyHighlight.cover}
          href={weeklyHighlight.slug.current}
          title={weeklyHighlight.title}
          category={'Weekbericht'}
          publicationDate={weeklyHighlight.publicationDate}
          isWeekly
        />
      </ArticleBox>
      {highlights.map((item: HighlightTeaserProps, index: number) => (
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
