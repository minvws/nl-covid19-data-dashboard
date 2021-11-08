import { ArrowIconRight } from '~/components/arrow-icon';
import { BackgroundImage } from '~/components/background-image';
import { Box } from '~/components/base';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { PublicationDate } from '~/components/publication-date';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { ImageBlock } from '~/types/cms';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
import { useBreakpoints } from '~/utils/use-breakpoints';

export interface ContentTeaserProps {
  title: string;
  slug: string;
  cover: ImageBlock;
  category?: string;
  publicationDate?: string;
  variant?: 'small' | 'normal';
  isWeeklyHighlight?: boolean;
  isArticle?: boolean;
}

export function ContentTeaser({
  title,
  slug,
  cover,
  category,
  publicationDate,
  variant = 'normal',
  isWeeklyHighlight,
  isArticle,
}: ContentTeaserProps) {
  const { siteText } = useIntl();
  const breakpoints = useBreakpoints(true);
  const imageWidth = variant === 'normal' ? (breakpoints.sm ? 186 : 90) : 90;

  return (
    <Box
      display="flex"
      spacingHorizontal={3}
      width="100%"
      alignItems="center"
      pr={3}
    >
      <Box maxWidth={imageWidth} width="100%">
        <BackgroundImage
          image={cover}
          height={variant === 'normal' ? (breakpoints.sm ? 108 : 66) : 66}
          sizes={[[imageWidth]]}
        />
      </Box>
      <Box maxWidth="25rem" spacing={publicationDate || category ? 2 : 0}>
        <Text variant="overline2" color="bodyLight">
          {publicationDate ? (
            <>
              {`${siteText.common_actueel.secties.meer_lezen.weekly_category} -`}
              <PublicationDate date={publicationDate} />
            </>
          ) : (
            category
          )}
        </Text>
        <Heading level={variant === 'normal' ? 4 : 5} as="h2" color="blue">
          <HeadingLinkWithIcon
            href={
              isAbsoluteUrl(slug)
                ? slug
                : isWeeklyHighlight
                ? `/weekberichten/${slug}`
                : isArticle
                ? `/artikelen/${slug}`
                : slug
            }
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
