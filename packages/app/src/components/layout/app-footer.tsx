import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import ExternalIcon from '~/assets/external-link-2.svg';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { MaxWidth } from '~/components/max-width';
import { useIntl } from '~/intl';
import { Link } from '~/utils/link';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { Markdown } from '~/components/markdown';

export function AppFooter() {
  const reverseRouter = useReverseRouter();
  const { siteText: text } = useIntl();

  return (
    <footer>
      <Box
        bg="blue"
        color="white"
        py={5}
        zIndex={4}
        position="relative"
        id="footer-navigation"
      >
        <MaxWidth
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          css={css({
            columnGap: '48px',
          })}
          spacingHorizontal
          px={{ _: 3, sm: 4, md: 3, lg: 4 }}
        >
          <Box>
            <Title>{text.nav.title}</Title>
            <nav aria-label={text.aria_labels.footer_keuze} role="navigation">
              <FooterList>
                <Item href="/">{text.nav.links.actueel}</Item>
                <Item href={reverseRouter.nl.index()}>
                  {text.nav.links.index}
                </Item>
                <Item href={reverseRouter.vr.index()}>
                  {text.nav.links.veiligheidsregio}
                </Item>
                <Item href={reverseRouter.gm.index()}>
                  {text.nav.links.gemeente}
                </Item>
              </FooterList>
            </nav>
          </Box>
          <Box>
            <Title>{text.nav.title}</Title>
            <nav aria-label={text.aria_labels.footer_keuze} role="navigation">
              <FooterList>
                <Item href="/over">{text.nav.links.over}</Item>
                <Item href="/veelgestelde-vragen">
                  {text.nav.links.veelgestelde_vragen}
                </Item>
                <Item href="/verantwoording">
                  {text.nav.links.verantwoording}
                </Item>
                <Item href="/over-risiconiveaus">
                  {text.nav.links.over_risiconiveaus}
                </Item>
                <Item href="/toegankelijkheid">
                  {text.nav.links.toegankelijkheid}
                </Item>
                <Item href={text.nav.links.meer_href} isExternal>
                  {text.nav.links.meer}
                </Item>
              </FooterList>
            </nav>
          </Box>

          <Box>
            <Title>{text.nav.title}</Title>
            <StyledMarkdown>
              <Markdown content="Voor vragen over de cijfers en grafieken op dit dashboard kunt u terecht op de pagina [Cijferverantwoording](/cijferverantwoording) en de pagina met [veelgestelde vragen](/veelgestelde-vragen). Hebt u tips voor het Coronadashboard of kunt u het antwoord op een vraag niet vinden, [neem dan contact op](mailto:coronadashboard@minvws.nl)." />
            </StyledMarkdown>
          </Box>
        </MaxWidth>
      </Box>
    </footer>
  );
}

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
    <ListItem isExternal={isExternal}>
      {isExternal ? (
        <>
          <IconContainer>
            <ExternalIcon />
          </IconContainer>
          <StyledExternalLink href={href}>{children}</StyledExternalLink>
        </>
      ) : (
        <Link href={href} passHref>
          <FooterLink>{children}</FooterLink>
        </Link>
      )}
    </ListItem>
  );
}

const Title = styled.div(
  css({
    mb: 3,
    fontSize: 3,
    fontWeight: 'bold',
  })
);

const FooterList = styled.ol(
  css({
    p: 0,
    m: 0,
    listStyle: 'none',
    fontSize: 2,
  })
);

const ListItem = styled.li<{ isExternal?: boolean }>((x) =>
  css({
    position: 'relative',
    // py: 2,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    pl: 3,
    mb: 2,

    '&:before': {
      position: 'absolute',
      top: 0,
      left: 0,
      content: x.isExternal ? null : '"›"',
    },

    '&:last-of-type': {
      mb: 0,
    },
  })
);

const IconContainer = styled.div(
  css({
    position: 'absolute',
    left: '-10px',
    top: 0,

    svg: {
      width: 24,
      height: 24,
    },
  })
);

const StyledMarkdown = styled.div(
  css({
    maxWidth: 280,

    p: {
      fontSize: 2,
    },

    a: {
      color: 'white',
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
