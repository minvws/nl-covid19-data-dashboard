import css from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { BackgroundImage } from '~/components-styled/background-image';
import { Box } from '~/components-styled/base';
import { Heading, InlineText, Text } from '~/components-styled/typography';
import { useIntl } from '~/intl';
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
  const { siteText } = useIntl();

  return (
    <Link passHref href={`/weekberichten/${slug}`}>
      <StyledEditorialTeaser>
        <CoverImage image={cover} />
        <StyledTextOverlay>
          <Box
            width={{ lg: '60%' }}
            position="absolute"
            bottom={3}
            left={3}
            right={3}
          >
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

function Arrow() {
  return (
    <span css={css({ svg: { height: '11px', width: '13px', mx: '3px' } })}>
      <ArrowIconRight />
    </span>
  );
}

type CoverImageProps = {
  image: ImageBlock;
};

function CoverImage({ image }: CoverImageProps) {
  return (
    <div
      css={css({
        width: '100%',
        height: '100%',
        position: 'absolute',
      })}
    >
      <ZoomContainer>
        <BackgroundImage
          image={image}
          height={'100%'}
          sizes={[
            // viewport min-width 1200px display images at max. 745px wide
            [1200, 745],
          ]}
        />
      </ZoomContainer>
      <div
        css={css({
          backgroundImage: `linear-gradient(to left, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.75))`,
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          position: 'absolute',
          pointerEvents: 'none',
        })}
      />
    </div>
  );
}

const ZoomContainer = styled.div(
  css({
    width: '100%',
    height: '100%',
    position: 'absolute',
  })
);

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
    },
  })
);
