import styled from 'styled-components';
import css from '@styled-system/css';
import { asResponsiveArray } from '~/style/utils';

import { LinkWithIcon } from '~/components-styled/link-with-icon';
import { Heading } from '~/components-styled/typography';
import { ArrowIconRight } from '~/components-styled/arrow-icon';
import { Box } from '~/components-styled/base';
import { DataSitemap } from './data-sitemap';
import { LinkGroup } from './link-group';

interface LinkBlockProps {
  header: string;
  links: QuickLink[];
}

interface QuickLink {
  href: string;
  text: string;
}

export function LinkBlock({ header, links }: LinkBlockProps) {
  return (
    <Container>
      <MainLinks>
        <Heading level={3} fontSize={3}>
          {header}
        </Heading>
        <LinkGroup links={links} />
      </MainLinks>
      <FilteredLinks>
        <DataSitemap />
      </FilteredLinks>
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

const MainLinks = styled(Box)(
  css({
    position: 'relative',
    flexGrow: 3,
    pb: asResponsiveArray({ _: 4, md: 0 }),
    pr: asResponsiveArray({ _: 0, md: 3 }),
  })
);

const FilteredLinks = styled(Box)(
  css({
    flexGrow: asResponsiveArray({ _: 2, lg: 3 }),
    pt: asResponsiveArray({ _: 4, md: 0 }),
    pl: asResponsiveArray({ _: 0, md: 4 }),
  })
);
