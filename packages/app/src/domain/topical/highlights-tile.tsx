import css from '@styled-system/css';
import { ArrowIconRight } from '~/components/arrow-icon';
import { BackgroundImage } from '~/components/background-image';
import { Box } from '~/components/base';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { PublicationDate } from '~/components/publication-date';
import { Heading, InlineText } from '~/components/typography';
import { VisuallyHidden } from '~/components/visually-hidden';
import { useIntl } from '~/intl';
import { Block, ImageBlock } from '~/types/cms';
import { useBreakpoints } from '~/utils/use-breakpoints';

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
  highlights: HighlightTeaserProps[];
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
          <HighlightTeaser
            title={weeklyHighlight.title}
            slug={weeklyHighlight.slug}
            cover={weeklyHighlight.cover}
            publicationDate={weeklyHighlight.publicationDate}
          />
        )}
        {highlights
          .map((item) => (
            <HighlightTeaser
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

interface HighlightTeaserProps {
  title: string;
  slug: string;
  cover: ImageBlock;
  category?: string;
  publicationDate?: string;
}

function HighlightTeaser({
  title,
  slug,
  cover,
  category,
  publicationDate,
}: HighlightTeaserProps) {
  const { siteText } = useIntl();
  const breakpoints = useBreakpoints(true);

  return (
    <Box
      display="flex"
      spacingHorizontal={3}
      width="100%"
      alignItems="center"
      pr={3}
    >
      <Box maxWidth={breakpoints.sm ? 186 : 90} width="100%">
        <BackgroundImage
          image={cover}
          height={breakpoints.sm ? 108 : 66}
          sizes={[
            // viewport min-width 1200px display images at max. 438px wide
            [1200, 438],
          ]}
        />
      </Box>
      <Box maxWidth="25rem" spacing={2}>
        <InlineText
          variant="overline2"
          color="bodyLight"
          css={css({ display: 'block' })}
        >
          {publicationDate ? (
            <>
              {`${siteText.common_actueel.secties.meer_lezen.weekly_category} -`}
              <PublicationDate date={publicationDate} />
            </>
          ) : (
            category
          )}
        </InlineText>
        <Heading level={3} as="h2" color="blue">
          <HeadingLinkWithIcon
            href={slug}
            icon={<ArrowIconRight />}
            iconPlacement="right"
            underline
          >
            {title}
          </HeadingLinkWithIcon>
        </Heading>
      </Box>
    </Box>
  );
}
