import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { Box } from './base';
import { Heading } from './typography';
import ArrowIcon from '~/assets/arrow.svg';
import { LinkWithIcon } from './link-with-icon';

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
    <Box>
      <Heading level={2} fontSize="1.125rem" m={0}>
        {header}
      </Heading>
      <List>
        {links.map((link, index) => (
          <Item key={`${link.text}-${index}`}>
            <Link href={link.href}>
              {/* <QuickLink href={link.href}>{link.text}</QuickLink> */}

              <LinkWithIcon
                href={link.href}
                icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />}
                iconPlacement="right"
                fontWeight="bold"
              >
                {link.text}
              </LinkWithIcon>
            </Link>
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
