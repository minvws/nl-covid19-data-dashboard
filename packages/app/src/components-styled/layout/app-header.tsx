import React from 'react';
import { Box } from '~/components-styled/base';
import { MaxWidth } from '~/components-styled/max-width';
import text from '~/locale/index';
import { LanguageSwitcher } from './components/language-switcher';
import { Logo } from './components/logo';
import { TopNavigation } from './components/top-navigation';

export function AppHeader() {
  return (
    <Box as="header" zIndex={4} position="relative" bg="white">
      <MaxWidth px={{ _: 3, sm: 4 }}>
        <Logo />
        <LanguageSwitcher />
      </MaxWidth>
      <Box backgroundColor="header" py={3} color="white">
        <MaxWidth
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
          px={{ _: 3, sm: 4, md: 3, lg: 4 }}
        >
          <Box
            fontSize={3}
            py={[2, 2, 2, 3]}
            lineHeight={'1em'}
            fontWeight="bold"
          >
            {text.header.title}
          </Box>

          <TopNavigation />
        </MaxWidth>
      </Box>
    </Box>
  );
}
