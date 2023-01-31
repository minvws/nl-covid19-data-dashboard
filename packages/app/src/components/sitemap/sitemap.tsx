import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { Heading } from '~/components/typography';
import { space } from '~/style/theme';
import { asResponsiveArray } from '~/style/utils';
import { LinkGroup, LinkGroupProps, LinkItemProps } from './link-group';

type SitemapProps = {
  quickLinksHeader: string;
  quickLinks: LinkItemProps[];
  dataSitemapHeader: string;
  dataSitemap: LinkGroupProps[];
};

export function Sitemap({ quickLinksHeader, quickLinks, dataSitemapHeader, dataSitemap }: SitemapProps) {
  return (
    <Box display="flex" paddingY={space[4]} flexDirection={{ _: 'column', md: 'row' }}>
      <Box
        position="relative"
        flexBasis={{ _: '33%', lg: '25%' }}
        paddingBottom={{ _: space[4], md: '0' }}
        paddingRight={{ _: '0', md: space[3] }}
        borderColor="gray3"
        borderStyle="solid"
        borderRightWidth={{ md: '1px' }}
        spacing={3}
      >
        <Heading level={3}>{quickLinksHeader}</Heading>
        <LinkGroup links={quickLinks} />
      </Box>

      <Box flexBasis={{ _: '66%', lg: '75%' }} paddingTop={{ _: space[4], md: '0' }} paddingLeft={{ _: '0', md: space[4] }} spacing={3}>
        <Heading level={3}>{dataSitemapHeader}</Heading>
        <Box display="flex" flexWrap="wrap">
          {dataSitemap.map((group: LinkGroupProps) => (
            <LinkGroupContainer key={group.header}>
              <LinkGroup key={group.header} header={group.header} links={group.links} />
            </LinkGroupContainer>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

const LinkGroupContainer = styled.div(
  css({
    flexGrow: 0,
    flexBasis: asResponsiveArray({ _: '100%', sm: '50%', lg: '33%' }),
    marginBottom: space[3],

    // Remove margin bottom of the last 2 or 3 items depending on the breakpoints
    ':nth-last-child(-n+2)': {
      marginBottom: asResponsiveArray({ sm: '0', lg: space[3] }),
    },

    ':nth-last-child(-n+3)': {
      marginBottom: asResponsiveArray({ lg: '0' }),
    },
  })
);
