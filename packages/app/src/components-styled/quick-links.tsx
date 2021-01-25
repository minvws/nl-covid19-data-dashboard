import css from '@styled-system/css';
import styled from 'styled-components';
import ArrowIcon from '~/assets/arrow.svg';
import { asResponsiveArray } from '~/style/utils';
import { Box } from './base';
import { LinkWithIcon } from './link-with-icon';
import { Heading } from './typography';

interface QuickLinksProps {
  header: string;
  links: QuickLink[];
}

interface QuickLink {
  href: string;
  text: string;
}

export function QuickLinks({ header, links }: QuickLinksProps) {
  return (
    <Box pb={{ _: 0, md: 3 }}>
      <Heading level={2} fontSize="1.125rem" m={0}>
        {header}
      </Heading>
      <List>
        {links.map((link, index) => (
          <Item key={`${link.text}-${index}`}>
            <LinkWithIcon
              href={link.href}
              icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />}
              iconPlacement="right"
              fontWeight="bold"
            >
              {link.text}
            </LinkWithIcon>
          </Item>
        ))}
      </List>
    </Box>
  );
}

const List = styled.ol(
  css({
    display: 'flex',
    flexDirection: asResponsiveArray({ _: 'column', md: 'row' }),
    m: 0,
    px: 0,
    py: asResponsiveArray({ _: 0, md: 1 }),
  })
);

const Item = styled.li(
  css({
    listStyle: 'none',
    mr: 4,
    py: 1,
  })
);
