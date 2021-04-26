import ChevronIcon from '~/assets/chevron.svg';
import ExternalLinkIcon from '~/assets/external-link-2.svg';
import { getImageProps } from '~/lib/sanity';
import { DecoratedLink as DecoratedLinkDocument } from '~/types/cms';
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
}: {
  title: string;
  href: string;
}) => {
  return (
    <Link href={href}>
      <a style={{ textDecoration: 'none' }}>
        <Box borderTop="1px solid gray" height="5rem">
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
              <ExternalLinkIcon />
            </Box>
          </Box>
        </Box>
      </a>
    </Link>
  );
};

export const ExpandedDecoratedLink = ({
  link,
}: {
  link: DecoratedLinkDocument;
}) => {
  return (
    <Link href={link.href}>
      <a style={{ textDecoration: 'none' }}>
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
              {...getImageProps(link.cover, {
                defaultWidth: 122,
              })}
            />
          </Box>
          <Box display="flex" py={3} pl={3}>
            <Box
              justifyContent="flex-start"
              display="flex"
              flexDirection="column"
            >
              <InlineText
                color="gray"
                fontWeight="bold"
                textTransform="uppercase"
              >
                {link.category}
              </InlineText>
              <InlineText fontSize={2} fontWeight="bold">
                {link.title}
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
              <ChevronIcon />
            </Box>
          </Box>
        </Box>
      </a>
    </Link>
  );
};
