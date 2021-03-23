import css from '@styled-system/css';
import React from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import { Link } from '~/utils/link';
import { LanguageSwitcher } from './components/language-switcher';
import { Logo } from './components/logo';
import { TopNavigation } from './components/top-navigation';
import { useIntl } from '~/intl';

export function AppHeader() {
  const { siteText } = useIntl();

  return (
    <Box as="header" zIndex={4} position="relative" bg="white">
      <MaxWidth px={{ _: 3, sm: 4, md: 3, lg: 4 }}>
        <Logo />
        <Box px={3} zIndex={1} position="relative">
          <LanguageSwitcher />
        </Box>
      </MaxWidth>
      <Box backgroundColor="header" py={3} color="white">
        <MaxWidth
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          px={{ _: 3, sm: 4, md: 3, lg: 4 }}
        >
          <Box py={[2, 2, 2, 3]} lineHeight={'1em'} fontWeight="bold">
            <Link href="/" passHref>
              <TextLogoLink>{siteText.header.title}</TextLogoLink>
            </Link>
          </Box>

          <TopNavigation />
        </MaxWidth>
      </Box>
    </Box>
  );
}

const TextLogoLink = styled.a(
  css({
    color: 'white',
    fontSize: 3,
    textDecoration: 'none',
    lineHeight: 2,
  })
);
