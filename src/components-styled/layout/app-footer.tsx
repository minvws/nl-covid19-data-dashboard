import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { ExternalLink } from '~/components-styled/external-link';
import { MaxWidth } from '~/components-styled/max-width';
import text from '~/locale/index';
import { formatDateFromSeconds } from '~/utils/formatDate';
import { Link } from '~/utils/link';
import { replaceVariablesInText } from '~/utils/replaceVariablesInText';

export function AppFooter({ lastGenerated }: { lastGenerated: string }) {
  return (
    <footer>
      <Box bg="blue" color="white" py={4} zIndex={4} position="relative">
        <MaxWidth
          display="flex"
          flexDirection={['column', null, 'row']}
          spacing={4}
          spacingHorizontal
          px={3}
        >
          <Box>
            <Box fontSize={3} fontWeight="bold">
              {text.nav.title}
            </Box>
            <nav
              aria-label={text.aria_labels.footer_keuze}
              role="navigation"
              id="footer-navigation"
            >
              <FooterList>
                <Item href="/">{text.nav.links.index}</Item>
                <Item href="/veiligheidsregio">
                  {text.nav.links.veiligheidsregio}
                </Item>
                <Item href="/gemeente">{text.nav.links.gemeente}</Item>
                <Item href="/over">{text.nav.links.over}</Item>
                <Item href="/veelgestelde-vragen">
                  {text.nav.links.veelgestelde_vragen}
                </Item>
                <Item href="/over-risiconiveaus">
                  {text.nav.links.over_risiconiveaus}
                </Item>
                <Item href="/verantwoording">
                  {text.nav.links.verantwoording}
                </Item>
                <Item href={text.nav.links.meer_href} isExternal>
                  {text.nav.links.meer}
                </Item>
              </FooterList>
            </nav>
          </Box>
          <LastGeneratedMessage date={lastGenerated} />
        </MaxWidth>
      </Box>
    </footer>
  );
}

function LastGeneratedMessage({ date }: { date: string }) {
  const dateIso = formatDateFromSeconds(Number(date), 'iso');
  const dateLong = formatDateFromSeconds(Number(date), 'long');

  return (
    <Box maxWidth={450}>
      <Box fontSize={3} fontWeight="bold">
        {text.laatst_bijgewerkt.title}
      </Box>
      <p
        dangerouslySetInnerHTML={{
          __html: replaceVariablesInText(text.laatst_bijgewerkt.message, {
            dateOfInsertion: `<time datetime=${dateIso}>${dateLong}</time>`,
          }),
        }}
      />
    </Box>
  );
}

const FooterList = styled.ol(
  css({
    p: 0,
    listStyle: 'none',
    fontSize: '1.125em',
  })
);

function Item({
  href,
  isExternal,
  children,
}: {
  href: string;
  children: ReactNode;
  isExternal?: boolean;
}) {
  return (
    <ListItem>
      {isExternal ? (
        <StyledExternalLink href={href}>{children}</StyledExternalLink>
      ) : (
        <Link href={href} passHref>
          <FooterLink>{children}</FooterLink>
        </Link>
      )}
    </ListItem>
  );
}

const ListItem = styled.li(
  css({
    p: 2,
    pl: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    '&:before': {
      content: '"›"',
      mr: 3,
    },
  })
);

const linkStyle = css({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  '&:focus': {
    outline: '2px dotted white',
  },
});

const FooterLink = styled.a(linkStyle);
const StyledExternalLink = styled(ExternalLink)(linkStyle);
