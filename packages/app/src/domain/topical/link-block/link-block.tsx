import styled from 'styled-components';
import css from '@styled-system/css';
import { asResponsiveArray } from '~/style/utils';

import { Heading } from '~/components-styled/typography';
import { Box } from '~/components-styled/base';
import { DataSitemap, DataSitemapProps } from './data-sitemap';
import { LinkGroup, Link, LinkGroupProps } from './link-group';
import siteText from '~/locale/index';

type LinkBlockProps = DataSitemapProps & {
  quickLinksHeader: string;
  quickLinks: Link[];
  dataSitemapHeader: string;
  dataSitemap: LinkGroupProps[];
};

export function LinkBlock({
  quickLinksHeader,
  quickLinks,
  dataSitemapHeader,
  dataSitemap,
}: LinkBlockProps) {
  return (
    <Container>
      <QuickLinks>
        <Heading level={3} fontSize={3}>
          {quickLinksHeader}
        </Heading>
        <LinkGroup links={quickLinks} />
      </QuickLinks>
      <Sitemap>
        <Heading level={3} fontSize={3}>
          {dataSitemapHeader}
        </Heading>
        <Box
          display="flex"
          flexWrap="wrap"
          css={css({
            '> div': {
              flexGrow: 0,
              flexBasis: asResponsiveArray({ _: '100%', sm: '50%', lg: '33%' }),
              mb: 3,
            },
          })}
        >
          {dataSitemap.map((group) => (
            <LinkGroup
              key={group.header}
              header={group.header}
              links={group.links}
            />
          ))}
        </Box>
      </Sitemap>
    </Container>
  );
}

const Container = styled(Box)(
  css({
    flexDirection: asResponsiveArray({ _: 'column', md: 'row' }),
    display: 'flex',
    px: 4,
    py: 4,

    '> div:not(:last-child)::after': {
      content: '""',
      position: 'absolute',
      bg: 'lightGray',
      bottom: 0,
      right: 0,
      height: asResponsiveArray({ _: '1px', md: '100%' }),
      width: asResponsiveArray({ _: '100%', md: '1px' }),
    },
  })
);

const QuickLinks = styled(Box)(
  css({
    position: 'relative',
    flexBasis: asResponsiveArray({ _: '33%', lg: '25%' }),
    pb: asResponsiveArray({ _: 4, md: 0 }),
    pr: asResponsiveArray({ _: 0, md: 3 }),
  })
);

const Sitemap = styled(Box)(
  css({
    flexBasis: asResponsiveArray({ _: '66%', lg: '75%' }),
    pt: asResponsiveArray({ _: 4, md: 0 }),
    pl: asResponsiveArray({ _: 0, md: 4 }),
  })
);
