import React from 'react';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { useIntl } from '~/intl';
import { Link } from '~/utils/link';
import { Anchor } from '../typography';
import { LanguageSwitcher } from './components/language-switcher';
import { Logo } from './components/logo';
import { TopNavigation } from './components/top-navigation';

export function AppHeader() {
  const { siteText } = useIntl();

  return (
    <Box as="header" zIndex={4} position="relative" bg="white">
      <MaxWidth px={{ _: 1, sm: 3 }}>
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
          pl={{ _: 3, sm: 4 }}
          pr={{ _: 3, sm: 4, md: 3 }}
        >
          <Box py={[2, 2, 2, 3]}>
            <Link href="/" passHref>
              <Anchor color="white" variant="h3">
                {siteText.header.title}
              </Anchor>
            </Link>
          </Box>

          <TopNavigation />
        </MaxWidth>
      </Box>
    </Box>
  );
}
