import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { useIntl } from '~/intl';
import { ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';
import { BackgroundImage } from './background-image';
import { Box } from './base';
import { PublicationDate } from './publication-date';
import { Heading, InlineText } from './typography';

export type HighlightTeaserProps = {
  title: string;
  cover: ImageBlock;
  label?: string;
  href: string;
  category: string;
  publicationDate?: string;
  isWeekly?: boolean;
};

export function HighlightTeaser(props: HighlightTeaserProps) {
  const {
    title,
    href,
    label,
    cover,
    category,
    isWeekly,
    publicationDate,
  } = props;

  const { siteText } = useIntl();

  return (
    <Link passHref href={href}>
      <StyledHightlightTeaser isWeekly={isWeekly}>
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
        <Box padding={isWeekly ? 3 : 0} pt={3}>
          <InlineText
            css={css({ textTransform: 'uppercase' })}
            fontSize="0.75rem"
            fontWeight="bold"
            color="annotation"
          >
            {category}
            {publicationDate && (
              <>
                {' - '}
                <PublicationDate date={publicationDate} />
              </>
            )}
          </InlineText>
          <Heading
            level={3}
            mb={{ _: 1, sm: 3 }}
            lineHeight={{ _: 0, sm: 1 }}
            fontSize="1.25rem"
          >
            {title}
          </Heading>

          <InlineText aria-hidden="true" fontWeight="bold" color="link">
            {label ? label : siteText.common.read_weekly}
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

const StyledHightlightTeaser = styled.a<{ isWeekly?: boolean }>((x) =>
  css({
    display: 'block',
    overflow: 'hidden',
    textDecoration: 'none',
    backgroundColor: x.isWeekly ? 'blue' : undefined,
    color: x.isWeekly ? 'white' : 'body',

    'span, time': {
      color: x.isWeekly ? 'white' : undefined,
    },

    [`${ZoomContainer}, ${Heading}`]: {
      transitionProperty: 'transform, color',
      transitionDuration: '500ms, 250ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',
    },

    '&:hover, &:focus': {
      [ZoomContainer]: {
        transitionTimingFunction: 'ease-in-out',
        transform: 'scale(1.04)',
      },
      [Heading]: { color: x.isWeekly ? undefined : 'link' },
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
