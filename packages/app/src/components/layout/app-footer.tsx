import css from '@styled-system/css';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import ExternalIcon from '~/assets/external-link-2.svg';
import { Box } from '~/components/base';
import { ExternalLink } from '~/components/external-link';
import { Markdown } from '~/components/markdown';
import { MaxWidth } from '~/components/max-width';
import { useIntl } from '~/intl';
import { useFeature } from '~/lib/features';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { useReverseRouter } from '~/utils/use-reverse-router';

export function AppFooter() {
  const reverseRouter = useReverseRouter();
  const { siteText: text } = useIntl();
  const internationalFeature = useFeature('internationalPage');

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
          gridTemplateColumns={{ sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
          css={css({
            columnGap: asResponsiveArray({ sm: '32px', md: '48px' }),
            rowGap: asResponsiveArray({ _: 4, md: null }),
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
                {internationalFeature.isEnabled ? (
                  <Item href={reverseRouter.in.index()}>
                    {text.nav.links.internationaal}
                  </Item>
                ) : null}
              </FooterList>
            </nav>
          </Box>
          <Box>
            <Title>{text.nav.meer_informatie}</Title>
            <nav aria-label={text.aria_labels.footer_keuze} role="navigation">
              <FooterList>
                <Item href={reverseRouter.algemeen.over()}>
                  {text.nav.links.over}
                </Item>
                <Item href={reverseRouter.algemeen.toegankelijkheid()}>
                  {text.nav.links.toegankelijkheid}
                </Item>
                <Item href={reverseRouter.algemeen.veelgesteldeVragen()}>
                  {text.nav.links.veelgestelde_vragen}
                </Item>
                <Item href={reverseRouter.algemeen.verantwoording()}>
                  {text.nav.links.verantwoording}
                </Item>
                <Item href={reverseRouter.algemeen.overRisiconiveaus()}>
                  {text.nav.links.over_risiconiveaus}
                </Item>
                <Item href={text.nav.links.meer_href} isExternal>
                  {text.nav.links.meer}
                </Item>
              </FooterList>
            </nav>
          </Box>

          <Box>
            <Title>{text.nav.contact}</Title>
            <StyledMarkdown>
              <Markdown content={text.nav.contact_beschrijving} />
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
    fontSize: 2,
    listStyle: 'none',
  })
);

const ListItem = styled.li<{ isExternal?: boolean }>((x) =>
  css({
    position: 'relative',
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
    maxWidth: asResponsiveArray({ sm: '90%', md: 280 }),

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
