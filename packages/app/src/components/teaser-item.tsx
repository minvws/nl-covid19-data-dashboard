import css from '@styled-system/css';
import { ArrowIconRight } from '~/components/arrow-icon';
import { BackgroundImage } from '~/components/background-image';
import { Box } from '~/components/base';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { PublicationDate } from '~/components/publication-date';
import { Heading, InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { ImageBlock } from '~/types/cms';
import { useBreakpoints } from '~/utils/use-breakpoints';

export interface TeaserItemProps {
  title: string;
  slug: string;
  cover: ImageBlock;
  category?: string;
  publicationDate?: string;
  variant?: 'small' | 'normal';
}

export function TeaserItem({
  title,
  slug,
  cover,
  category,
  publicationDate,
  variant = 'normal',
}: TeaserItemProps) {
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
        maxWidth={variant === 'normal' ? (breakpoints.sm ? 186 : 90) : 91}
        width="100%"
      >
        <BackgroundImage
          image={cover}
          height={variant === 'normal' ? (breakpoints.sm ? 108 : 66) : 67}
          sizes={[[1200, 438]]}
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
        <Heading level={3} as="h2" color="blue" variant="h5">
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
