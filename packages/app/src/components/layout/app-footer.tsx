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
import { Anchor, Heading } from '../typography';

export function AppFooter() {
  const reverseRouter = useReverseRouter();
  const { siteText: text } = useIntl();
  const internationalFeature = useFeature('inHomePage');

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
          px={{ _: 3, sm: 4, md: 3, lg: 4 }}
        >
          <Box spacing={3}>
            <Heading as="div" level={3}>
              {text.nav.title}
            </Heading>
            <nav aria-label={text.aria_labels.footer_keuze} role="navigation">
              <Box as="ul" spacing={2}>
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
              </Box>
            </nav>
          </Box>
          <Box spacing={3}>
            <Heading as="div" level={3}>
              {text.nav.meer_informatie}
            </Heading>
            <nav aria-label={text.aria_labels.footer_keuze} role="navigation">
              <Box as="ul" spacing={2}>
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
              </Box>
            </nav>
          </Box>

          <Box spacing={3}>
            <Heading as="div" level={3}>
              {text.nav.contact}
            </Heading>
            <Box
              maxWidth={{ sm: '90%', md: 280 }}
              css={css({ a: { color: 'white' } })}
            >
              <Markdown content={text.nav.contact_beschrijving} />
            </Box>
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
          <ExternalLink color="white" href={href} underline="hover">
            {children}
          </ExternalLink>
        </>
      ) : (
        <Link href={href} passHref>
          <Anchor underline="hover" color="white">
            {children}
          </Anchor>
        </Link>
      )}
    </ListItem>
  );
}

const ListItem = styled.li<{ isExternal?: boolean }>((x) =>
  css({
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    pl: 3,

    '&:before': {
      position: 'absolute',
      top: 0,
      left: 0,
      content: x.isExternal ? null : '"›"',
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
