import { colors } from '@corona-dashboard/common';
import { External } from '@corona-dashboard/icons';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import styled from 'styled-components';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { SanityImage } from '~/components/cms/sanity-image';
import { ExternalLink } from '~/components/external-link';
import { MaxWidth } from '~/components/max-width';
import { Anchor, Heading } from '~/components/typography';
import { getImageProps } from '~/lib/sanity';
import type { AdviceLink as AdviceLinkType } from '~/queries/query-types';
import { fontSizes, fontWeights, mediaQueries, radii, sizes, space } from '~/style/theme';
import { ImageBlock } from '~/types/cms';
import { isInternalUrl } from '~/utils/is-internal-url';
import { Link } from '~/utils/link';

interface AdviceProps {
  title: string;
  description: PortableTextEntry[];
  links: AdviceLinkType[];
  image: ImageBlock;
}

export const Advice = ({ title, description, links, image }: AdviceProps) => {
  return (
    <Box width="100%" backgroundColor={colors.blue1} marginY={space[4]}>
      <MaxWidth
        alignItems={{ _: 'flex-start', sm: 'center' }}
        display="flex"
        flexDirection={{ _: 'column', sm: 'row' }}
        justifyContent="space-between"
        margin="0"
        paddingX={{ _: space[3], sm: space[4] }}
        paddingY={{ _: space[4], sm: space[4] }}
      >
        <Box maxWidth={sizes.maxWidthText}>
          <Heading level={2} variant="h2">
            {title}
          </Heading>

          <RichContent blocks={description} contentWrapper={AdviceDescription} />

          <UnorderedList>
            {links.map((link) => (
              <ListItem key={link.id}>
                {isInternalUrl(link.linkUrl) ? (
                  <Link href={link.linkUrl} passHref>
                    <Anchor>{link.linkLabel}</Anchor>
                  </Link>
                ) : (
                  <ExternalLink href={link.linkUrl}>
                    {link.linkLabel}
                    <External />
                  </ExternalLink>
                )}
              </ListItem>
            ))}
          </UnorderedList>
        </Box>

        <Box display="flex" justifyContent={{ _: 'center', sm: 'flex-start' }} maxHeight="520px">
          <SanityImage {...getImageProps(image, { defaultWidth: '300px' })} />
        </Box>
      </MaxWidth>
    </Box>
  );
};

const AdviceDescription = styled(Box)`
  font-size: ${fontSizes[3]};
  margin-block: ${space[3]};

  @media ${mediaQueries.md} {
    margin-block: ${space[3]} ${space[5]};
  }
`;

const UnorderedList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[3]};
  list-style: none;
  margin-block: ${space[4]};
`;

const ListItem = styled.li`
  ${Anchor} {
    // We can style an Anchor here because both Link and ExternalLink render an Anchor
    align-items: center;
    background-color: ${colors.white};
    border-radius: ${radii[1]}px;
    color: ${colors.blue8};
    display: flex;
    font-weight: ${fontWeights.bold};
    padding: 12px ${space[3]};

    &:hover {
      background-color: ${colors.blue8};
      color: ${colors.white};
    }

    svg {
      height: 11px;
      margin-left: 12px;
      width: 11px;
    }
  }
`;
