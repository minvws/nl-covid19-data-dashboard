import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { BackgroundImage } from '~/components-styled/background-image';
import { Box } from '~/components-styled/base';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { getImageSrc } from '~/lib/sanity';
import siteText from '~/locale';
import { Block, Editorial, ImageBlock } from '~/types/cms';
import { Link } from '~/utils/link';

export type EditorialSummary = Pick<
  Editorial,
  'title' | 'slug' | 'summary' | 'cover'
>;

type EditorialTeaserProps = {
  title: string;
  slug: string;
  summary: Block;
  cover: ImageBlock;
};

export function EditorialTeaser(props: EditorialTeaserProps) {
  const { title, slug, summary, cover } = props;

  return (
    <Link passHref href={`/weekberichten/${slug}`}>
      <StyledEditorialTeaser>
        <CoverImage image={cover} />
        <StyledTextOverlay>
          <Box width={{ lg: '60%' }} position="absolute" bottom={3} left={3}>
            <Heading level={3} fontSize={5} lineHeight="1em">
              {title}
            </Heading>
            <Text>{summary}</Text>
            <InlineText aria-hidden="true" fontWeight="bold" color="white">
              {siteText.common.read_more}
              <Arrow />
            </InlineText>
          </Box>
        </StyledTextOverlay>
      </StyledEditorialTeaser>
    </Link>
  );
}

const StyledTextOverlay = styled.div(
  css({
    width: '100%',
    minHeight: '26rem',
    height: '100%',
  })
);

const StyledEditorialTeaser = styled.a(
  css({
    position: 'relative',
    display: 'block',
    border: 'solid',
    borderWidth: 1,
    borderColor: 'lightGray',
    borderRadius: 4,
    minHeight: '26rem',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'white',
    height: '100%',

    [`${BackgroundImage}, ${Heading}`]: {
      transitionProperty: 'transform, color',
      transitionDuration: '500ms, 250ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',
    },

    '&:hover, &:focus': {
      [BackgroundImage]: {
        transitionTimingFunction: 'ease-in-out',
        transform: 'scale(1.04)',
      },
    },
  })
);

function Arrow() {
  return (
    <span css={css({ svg: { height: '11px', width: '13px', mx: '3px' } })}>
      <ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />
    </span>
  );
}

type CoverImageProps = {
  image: ImageBlock;
};

function CoverImage({ image }: CoverImageProps) {
  const bgPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : undefined;

  const url = getImageSrc(image.asset, 700);

  return (
    <BackgroundImage
      position="absolute"
      top={0}
      left={0}
      height="100%"
      width="100%"
      backgroundImage={`linear-gradient(to left, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.75)), url(${url})`}
      backgroundPosition={bgPosition}
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      aria-label={image.alt}
    />
  );
}
