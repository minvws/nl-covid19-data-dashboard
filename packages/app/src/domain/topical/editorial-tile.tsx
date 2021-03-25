import { Box } from '~/components-styled/base';
import {
  HighlightTeaser,
  HighlightTeaserProps,
} from '~/components-styled/highlight-teaser';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { ArticleBox } from './article-list';
import { EditorialSummary } from './editorial-teaser';

type EditorialTileProps = {
  editorial: EditorialSummary;
  highlights: HighlightTeaserProps[];
};

export function EditorialTile(props: EditorialTileProps) {
  const { editorial, highlights } = props;
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
          cover={editorial.cover}
          href={editorial.slug.current}
          title={editorial.title}
          category={'Weekbericht'}
          publicationDate={editorial.publicationDate}
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
