import { colors } from '@corona-dashboard/common';
import { External as ExternalIcon } from '@corona-dashboard/icons';
import { PortableTextEntry } from '@sanity/block-content-to-react';
import styled from 'styled-components';
import { Box } from '~/components/base/box';
import { RichContent } from '~/components/cms/rich-content';
import { SanityImage } from '~/components/cms/sanity-image';
import { ExternalLink } from '~/components/external-link';
import { MaxWidth } from '~/components/max-width';
import { Heading } from '~/components/typography';
import { getImageProps } from '~/lib/sanity';
import { fontSizes, fontWeights, mediaQueries, radii, sizes, space } from '~/style/theme';
import { ImageBlock, LinkProps } from '~/types/cms';
import { isInternalUrl } from '~/utils/is-internal-url';
import { Link } from '~/utils/link';

interface AdviceProps {
  title: string;
  description: PortableTextEntry[];
  links: LinkProps[];
  image: ImageBlock;
}

export const Advice = ({ title, description, links, image }: AdviceProps) => (
  <Box width="100%" backgroundColor={colors.blue1} marginY={space[4]}>
    <AdviceContainer
      alignItems={{ _: 'flex-start', sm: 'center' }}
      display="flex"
      flexDirection={{ _: 'column', sm: 'row' }}
      justifyContent="space-between"
      paddingX={{ _: space[3], sm: space[4] }}
      paddingY={space[4]}
    >
      <Box maxWidth={sizes.maxWidthText}>
        <Heading level={2} variant="h2">
          {title}
        </Heading>

        <RichContent blocks={description} contentWrapper={AdviceDescription} />

        <UnorderedList>
          {links.map((link, index) => (
            <ListItem key={index}>
              {isInternalUrl(link.href) ? (
                <Link href={link.href}>{link.title}</Link>
              ) : (
                <ExternalLink href={link.href}>
                  {link.title}
                  <ExternalIcon />
                </ExternalLink>
              )}
            </ListItem>
          ))}
        </UnorderedList>
      </Box>

      <AdviceImage {...getImageProps(image, { defaultWidth: '300px' })} />
    </AdviceContainer>
  </Box>
);

const AdviceContainer = styled(MaxWidth)`
  column-gap: ${space[4]};
`;

const AdviceDescription = styled(Box)`
  font-size: ${fontSizes[3]};
  margin-block: ${space[3]};

  @media ${mediaQueries.md} {
    margin-block: ${space[3]} ${space[5]};
  }
`;

const AdviceImage = styled(SanityImage)`
  align-self: center;
`;

const UnorderedList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: ${space[4]} ${space[3]};
  list-style: none;
  margin-block: ${space[4]};
`;

const ListItem = styled.li`
  a {
    background-color: ${colors.white};
    border-radius: ${radii[1]}px;
    color: ${colors.blue8};
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
