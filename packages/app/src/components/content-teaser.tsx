import { ArrowIconRight } from '~/components/arrow-icon';
import { BackgroundImage } from '~/components/background-image';
import { Box } from '~/components/base';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { PublicationDate } from '~/components/publication-date';
import { Heading, Text } from '~/components/typography';
import { useIntl } from '~/intl';
import { ImageBlock } from '~/types/cms';
import { useBreakpoints } from '~/utils/use-breakpoints';

export interface ContentTeaserProps {
  title: string;
  slug: string;
  cover: ImageBlock;
  category?: string;
  publicationDate?: string;
  variant?: 'small' | 'normal';
}

export function ContentTeaser({
  title,
  slug,
  cover,
  category,
  publicationDate,
  variant = 'normal',
}: ContentTeaserProps) {
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
      <Box
        maxWidth={variant === 'normal' ? (breakpoints.sm ? 186 : 90) : 90}
        width="100%"
      >
        <BackgroundImage
          image={cover}
          height={variant === 'normal' ? (breakpoints.sm ? 108 : 66) : 66}
          sizes={[[1200, 438]]}
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
        <Heading level={variant === 'normal' ? 3 : 5} as="h2" color="blue">
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
