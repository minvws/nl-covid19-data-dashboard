import styled from 'styled-components';
import css from '@styled-system/css';
import { asResponsiveArray } from '~/style/utils';

import { Heading } from '~/components-styled/typography';
import { Box } from '~/components-styled/base';
import { DataSitemap } from './data-sitemap';
import { LinkGroup, Link } from './link-group';
import siteText from '~/locale/index';

type LinkBlockProps = {
  quickLinksHeader?: string;
  quickLinks: Link[];
};

export function LinkBlock({
  quickLinksHeader = siteText.common_actueel.quick_links.overview.header,
  quickLinks,
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
        <DataSitemap />
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
    flexGrow: 3,
    pb: asResponsiveArray({ _: 4, md: 0 }),
    pr: asResponsiveArray({ _: 0, md: 3 }),
  })
);

const Sitemap = styled(Box)(
  css({
    flexGrow: asResponsiveArray({ _: 2, lg: 3 }),
    pt: asResponsiveArray({ _: 4, md: 0 }),
    pl: asResponsiveArray({ _: 0, md: 4 }),
  })
);
