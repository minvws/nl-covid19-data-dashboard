import css from '@styled-system/css';
import React from 'react';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import text from '~/locale/index';
import { Link } from '~/utils/link';
import { Text } from '../typography';
import { LanguageSwitcher } from './components/language-switcher';
import { Logo } from './components/logo';
import { TopNavigation } from './components/top-navigation';

export function AppHeader() {
  return (
    <Box as="header" zIndex={4} position="relative" bg="white">
      <MaxWidth px={{ _: 3, sm: 4, md: 3, lg: 4 }}>
        <Logo />
        <Box px={3}>
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
              <Text
                as="a"
                color="inherit"
                fontSize={3}
                css={css({ textDecoration: 'none' })}
              >
                {text.header.title}
              </Text>
            </Link>
          </Box>

          <TopNavigation />
        </MaxWidth>
      </Box>
    </Box>
  );
}
