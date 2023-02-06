import React from 'react';
import { Box } from '~/components/base';
import { MaxWidth } from '~/components/max-width';
import { useIntl } from '~/intl';
import { space } from '~/style/theme';
import { Link } from '~/utils/link';
import { Anchor } from '../typography';
import { LanguageSwitcher } from './components/language-switcher';
import { Logo } from './components/logo';
import { TopNavigation } from './components/top-navigation';

export function AppHeader() {
  const { commonTexts } = useIntl();

  return (
    <Box as="header" zIndex={4} position="relative" bg="white">
      <MaxWidth paddingX={{ _: space[1], sm: space[3] }}>
        <Logo />
        <Box paddingX={space[3]} zIndex={1} position="relative">
          <LanguageSwitcher />
        </Box>
      </MaxWidth>
      <Box backgroundColor="magenta3" paddingY={space[3]} color="white">
        <MaxWidth
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          paddingLeft={{ _: space[3], sm: space[4] }}
          paddingRight={{ _: space[3], sm: space[4], md: space[3] }}
        >
          <Box paddingY={{ _: space[2], md: space[3] }}>
            <Link href="/" passHref>
              <Anchor color="white" variant="h3">
                {commonTexts.header.title}
              </Anchor>
            </Link>
          </Box>

          <TopNavigation />
        </MaxWidth>
      </Box>
    </Box>
  );
}
