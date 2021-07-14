import css from '@styled-system/css';
import styled from 'styled-components';
import ChevronLargeIcon from '~/assets/chevron-large.svg';
import ChevronIcon from '~/assets/chevron.svg';
import ExternalLinkIcon from '~/assets/external-link-2.svg';
import { getImageProps } from '~/lib/sanity';
import { DecoratedLink as DecoratedLinkDocument } from '~/types/cms';
import { isAbsoluteUrl } from '~/utils/is-absolute-url';
import { Link } from '~/utils/link';
import { Box } from './base';
import { SanityImage } from './cms/sanity-image';
import { InlineText } from './typography';

type DecoratedLinkProps = {
  link: DecoratedLinkDocument;
  compact: boolean;
};

/**
 * This component displays an image, a category, a title and an associated link.
 * The compact version only shows the title with the link.
 */
export const DecoratedLink = (props: DecoratedLinkProps) => {
  const { link, compact } = props;
  return compact ? (
    <CompactDecoratedLink title={link.title} href={link.href} />
  ) : (
    <ExpandedDecoratedLink link={link} />
  );
};

export const CompactDecoratedLink = ({
  title,
  href,
  isFirst,
}: {
  title: string;
  href: string;
  isFirst?: boolean;
}) => {
  return (
    <Link href={href} passHref>
      <StyledCompactDecoratedLink>
        <Box
          borderTop={isFirst ? null : '1px solid'}
          borderTopColor="border"
          height="5rem"
        >
          <Box display="flex" height="5rem">
            <Box
              pl={3}
              display="flex"
              alignSelf="auto"
              justifyContent="center"
              alignItems="center"
            >
              <InlineText fontSize={2} fontWeight="bold">
                {title}
              </InlineText>
            </Box>
            <Box
              width="5rem"
              display="flex"
              alignSelf="center"
              justifyContent="center"
              alignItems="center"
              marginLeft="auto"
              color="link"
            >
              {isAbsoluteUrl(href) ? (
                <ExternalLinkIcon />
              ) : (
                <ChevronLargeIcon />
              )}
            </Box>
          </Box>
        </Box>
      </StyledCompactDecoratedLink>
    </Link>
  );
};

const StyledCompactDecoratedLink = styled.a(
  css({
    textDecoration: 'none',
    '&:hover, &:focus': { textDecoration: 'underline' },
  })
);

function ExpandedDecoratedLink({ link }: { link: DecoratedLinkDocument }) {
  return (
    <Link href={link.href} passHref>
      <StyledExpandedDecoratedLink>
        <Box display="flex">
          <Box
            width={122}
            minWidth={122}
            maxHeight={122}
            overflow="hidden"
            pl={3}
            py={3}
          >
            <SanityImage
              {...getImageProps(link.cover, { defaultWidth: 122 })}
            />
          </Box>
          <Box display="flex" py={3} pl={3}>
            <InlineText fontSize={2} fontWeight="bold">
              {link.title}
            </InlineText>

            <Box
              width="5rem"
              display="flex"
              alignSelf="center"
              justifyContent="center"
              alignItems="center"
              marginLeft="auto"
              color="link"
            >
              <ChevronIcon width="9px" />
            </Box>
          </Box>
        </Box>
      </StyledExpandedDecoratedLink>
    </Link>
  );
}

const StyledExpandedDecoratedLink = styled.a(
  css({
    textDecoration: 'none',
    color: 'body',

    '&:hover, &:focus': {
      color: 'link',
    },
  })
);
