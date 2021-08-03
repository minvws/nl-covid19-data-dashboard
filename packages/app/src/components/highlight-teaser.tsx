import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components/arrow-icon';
import { useIntl } from '~/intl';
import { ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { BackgroundImage } from './background-image';
import { Box } from './base';
import { PublicationDate } from './publication-date';
import { Heading, InlineText } from './typography';

type HighlightTeaserVariant = 'blue' | 'default';
export interface HighlightTeaserProps {
  title: string;
  cover: ImageBlock;
  label?: string;
  href: string;
  category?: string;
  publicationDate?: string;
  isWeekly?: boolean;
  variant?: HighlightTeaserVariant;
}

export function HighlightTeaser(props: HighlightTeaserProps) {
  const {
    title,
    href,
    label,
    cover,
    category,
    publicationDate,
    variant = 'default',
  } = props;

  const { siteText } = useIntl();

  const isDefault = variant === 'default';

  return (
    <Link passHref href={href}>
      <StyledHightlightTeaser variant={variant}>
        <ZoomContainer height={200}>
          <BackgroundImage
            image={cover}
            height={200}
            sizes={[
              // viewport min-width 1200px display images at max. 438px wide
              [1200, 438],
            ]}
          />
        </ZoomContainer>
        <Box padding={isDefault ? 0 : 3} pt={3} spacing={3}>
          <InlineText variant="overline2">
            {isDefault
              ? category
              : siteText.common_actueel.secties.meer_lezen.weekly_category}
            {publicationDate && (
              <>
                {' - '}
                <PublicationDate date={publicationDate} />
              </>
            )}
          </InlineText>
          <Heading level={3} variant="h4">
            {title}
          </Heading>

          <InlineText
            aria-hidden="true"
            fontWeight="bold"
            color={variant === 'default' ? 'link' : 'white'}
          >
            {label
              ? label
              : siteText.common_actueel.secties.meer_lezen.read_weekly_message}
            <Arrow />
          </InlineText>
        </Box>
      </StyledHightlightTeaser>
    </Link>
  );
}

const ZoomContainer = styled(ZoomContainerUnstyled)``;

function ZoomContainerUnstyled({
  children,
  height,
  className,
}: {
  height: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Box overflow="hidden" height={height} position="relative">
      <Box className={className}>{children}</Box>
    </Box>
  );
}

const StyledHightlightTeaser = styled.a<{
  variant?: HighlightTeaserVariant;
}>((x) =>
  css({
    display: 'block',
    overflow: 'hidden',
    textDecoration: 'none',
    backgroundColor: x.variant ? x.variant : undefined,
    color: x.variant === 'default' ? 'body' : 'white',

    span: {
      color: x.variant === 'default' ? undefined : 'white',
    },

    [`${ZoomContainer}, ${Heading}`]: {
      transitionProperty: 'transform, color',
      transitionDuration: '500ms, 250ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',
    },

    '&:hover, &:focus': {
      [ZoomContainer]: {
        transitionDuration: '200ms, 250ms',
        transitionTimingFunction: 'ease-in-out',
        transform: 'scale(1.04)',
      },
      [Heading]: { color: x.variant === 'default' ? 'link' : undefined },
    },
  })
);

function Arrow() {
  return (
    <span css={css({ svg: { height: '11px', width: '13px', mx: '3px' } })}>
      <ArrowIconRight />
    </span>
  );
}
