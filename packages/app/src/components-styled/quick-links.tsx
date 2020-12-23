import css from '@styled-system/css';
import styled from 'styled-components';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { Text } from './typography';

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
    <>
      <Text as="h2">{header}</Text>
      <List>
        {links.map((link, index) => (
          <Item key={`${link.text}-${index}`}>
            <Link href={link.href}>
              <QuickLink href={link.href}>{link.text}</QuickLink>
            </Link>
          </Item>
        ))}
      </List>
    </>
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

const QuickLink = styled.a(
  css({
    textDecoration: 'none',
    fontWeight: 'bold',
    display: 'inline-block',
    pr: 3,
    backgroundImage: `url('/images/chevron.svg')`,
    // match aspect ratio of chevron.svg
    backgroundSize: '0.6em 1.2em',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '100% 50%',
  })
);
