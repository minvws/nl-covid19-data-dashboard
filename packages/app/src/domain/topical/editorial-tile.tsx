import { Box } from '~/components-styled/base';
import { useBreakpoints } from '~/utils/useBreakpoints';
import { EditorialSummary } from './editorial-teaser';
import { EditorialTeaser } from './editorial-teaser';
import {
  HighlightTeaser,
  HighlightTeaserProps,
} from '~/components-styled/highlight-teaser';

type EditorialTileProps = {
  editorial: EditorialSummary;
  highlight: HighlightTeaserProps;
};

export function EditorialTile(props: EditorialTileProps) {
  const { editorial, highlight } = props;
  const breakpoints = useBreakpoints();

  return (
    <Box
      display="flex"
      spacingHorizontal={breakpoints.lg}
      spacing={3}
      flexDirection={{ _: 'column', lg: 'row' }}
    >
      <Box flex={{ lg: '1 1 66%' }}>
        <EditorialTeaser
          cover={editorial.cover}
          slug={editorial.slug.current}
          summary={editorial.summary}
          title={editorial.title}
        />
      </Box>
      <Box flex={{ lg: '1 1 33%' }}>
        <HighlightTeaser
          cover={highlight.cover}
          link={highlight.link}
          summary={highlight.summary}
          title={highlight.title}
        />
      </Box>
    </Box>
  );
}
